"use server";

import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { checkImportFile, imageMediaType } from "@/lib/ai-import/file-rules";
import { docxToText } from "@/lib/ai-import/docx-text";
import { extractWithGemini, MissingKeyError, type ExtractInput } from "@/lib/ai-import/gemini-extractor";
import { parseImportSettings } from "@/lib/ai-import/parse-settings";
import { validateImportedItems } from "@/lib/ai-import/validate-items";
import type { ExtractedDraft } from "@/lib/ai-import/types";

type Result = { success: true; draft: ExtractedDraft } | { success: false; error: string };

export async function extractItems(form: FormData): Promise<Result> {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, error: "You must be logged in." };
    const classId = String(form.get("classId") ?? "");
    const owned = await prisma.class.count({ where: { id: classId, instructorId: user.id } });
    if (!owned) return { success: false, error: "Only the Instructor of a Class can import Items." };

    const file = form.get("file");
    if (!(file instanceof File)) return { success: false, error: "Choose a file first." };
    const checked = checkImportFile(file);
    if ("error" in checked) return { success: false, error: checked.error };

    const settings = parseImportSettings(form);
    const data = Buffer.from(await file.arrayBuffer());
    let input: ExtractInput;
    if (checked.kind === "docx") {
      const text = await docxToText(data).catch(() => "");
      if (!text) return { success: false, error: "We could not read that Word file." };
      input = { kind: "docx", text };
    } else {
      input = { kind: checked.kind, data, mediaType: checked.kind === "pdf" ? "application/pdf" : imageMediaType(file.name, file.type) };
    }

    const output = await extractWithGemini(input, settings).catch((error) => {
      if (error instanceof MissingKeyError) throw error;
      return null;
    });
    if (!output) return { success: false, error: "The AI could not read that file. Try a clearer copy." };
    const { items, dropped } = validateImportedItems(output.items, settings);
    if (items.length === 0) return { success: false, error: "No items were found in that file." };
    return {
      success: true,
      draft: {
        title: output.title?.trim() ?? "",
        instructions: output.instructions?.trim() ?? "",
        fileName: file.name,
        pages: output.pages ?? null,
        items,
        dropped,
      },
    };
  } catch (error) {
    return { success: false, error: error instanceof MissingKeyError ? error.message : "Something went wrong reading that file." };
  }
}
