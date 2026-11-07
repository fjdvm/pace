import { generateText, Output } from "ai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { buildImportPrompt } from "./prompt";
import { importSchema } from "./schema";
import type { ImportSettings } from "./types";

export type ExtractInput =
  | { kind: "pdf" | "image"; data: Buffer; mediaType: string }
  | { kind: "docx"; text: string };

export class MissingKeyError extends Error {
  constructor() {
    super("AI import is not set up yet. Ask an Admin to add the Gemini key.");
  }
}

export async function extractWithGemini(input: ExtractInput, settings: ImportSettings) {
  const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
  if (!apiKey) throw new MissingKeyError();
  const model = createGoogleGenerativeAI({ apiKey })("gemini-2.5-flash");
  const content =
    input.kind === "docx"
      ? [{ type: "text" as const, text: input.text }]
      : [{ type: "file" as const, data: input.data, mediaType: input.mediaType }];
  const { output } = await generateText({
    model,
    timeout: 120_000,
    output: Output.object({ schema: importSchema }),
    system: buildImportPrompt(settings),
    messages: [{ role: "user", content }],
  });
  return output;
}
