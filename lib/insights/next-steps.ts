import { generateText, jsonSchema, Output } from "ai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";

export const NOT_PROOF_NOTE =
  "These are suggestions from the AI. A flag is not proof of copying; you make the final call.";

export interface NextSteps {
  summary: string;
  explanation: string;
  suggestedComment: string;
  similarNote: string;
  draftNote: string;
}

export interface InsightFacts {
  studentFirstName: string;
  itemNumber: number;
  flag: "Low" | "Medium" | "High";
  typed: number;
  pasted: number;
  pastePercent: number;
  tabLeaves: number;
  awaySecs: number;
  tutorQuestions: number;
  testsPassed: number | null;
  testsTotal: number | null;
  similarTo: { name: string; percent: number } | null;
}

const text = { type: "string", maxLength: 400 } as const;
const schema = jsonSchema<NextSteps>({
  type: "object",
  properties: { summary: text, explanation: text, suggestedComment: text, similarNote: text, draftNote: text },
  required: ["summary", "explanation", "suggestedComment", "similarNote", "draftNote"],
  additionalProperties: false,
});

export function buildNextStepsPrompt(facts: InsightFacts) {
  return [
    "You help a teacher review a student's work. Use only the facts given. Never say the student copied or cheated; a flag is not proof.",
    `Write: summary (one sentence about how the code was written), explanation (why asking ${facts.studentFirstName} to explain their code helps),`,
    `suggestedComment (a short, kind private message to ${facts.studentFirstName} asking about their code), similarNote (what the similarity result means),`,
    "draftNote (why to keep the grade as a draft until the student replies). Plain sentences, no markdown.",
    `Facts: ${JSON.stringify(facts)}`,
  ].join("\n");
}

export class MissingKeyError extends Error {}

export async function generateNextSteps(facts: InsightFacts): Promise<NextSteps> {
  const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
  if (!apiKey) throw new MissingKeyError("Insights are not set up yet. Ask an Admin to add the Gemini key.");
  const { output } = await generateText({
    model: createGoogleGenerativeAI({ apiKey })("gemini-2.5-flash"),
    output: Output.object({ schema }),
    prompt: buildNextStepsPrompt(facts),
  });
  return output;
}
