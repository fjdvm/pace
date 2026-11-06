"use server";

import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { parseDraft } from "@/lib/study/draft";
import type { FormState } from "@/lib/study/form-progress";
import { getQuestionnaireClosedAt } from "@/lib/study/questionnaire-status";
import { getOrCreateRespondent, submittedSittings } from "@/lib/study/respondent-store";

export async function saveStudyDraft(role: string, sitting: number, state: FormState) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Sign in to save your answers");
    if (await getQuestionnaireClosedAt()) throw new Error("The questionnaire is closed");

    if (role !== "student" && role !== "instructor") throw new Error("Choose student or instructor");
    const respondent = await getOrCreateRespondent(user.id, role);
    const parsed = parseDraft(role, sitting, state, await submittedSittings(respondent.id));
    if (!parsed.ok) throw new Error(parsed.error);

    await prisma.studyDraft.upsert({
      where: { respondentId_sitting: { respondentId: respondent.id, sitting } },
      create: { respondentId: respondent.id, sitting, state: parsed.value.state },
      update: { state: parsed.value.state },
    });
    return { success: true };
  } catch (err) {
    console.error("Failed to save study draft:", err);
    return { success: false, error: err instanceof Error ? err.message : "Unknown error" };
  }
}
