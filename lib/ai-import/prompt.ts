import type { ImportSettings } from "./types";

export function buildImportPrompt(settings: ImportSettings) {
  const kinds =
    settings.kinds === "auto"
      ? "Detect each item's kind: coding, multiple_choice or short_answer."
      : `Every item is of kind ${settings.kinds}.`;
  return [
    "You read an activity sheet and extract each task as a separate item. Never invent tasks that are not in the file.",
    kinds,
    `Coding items use ${settings.language}.`,
    "Use the points shown in the file, or 10 when none are shown.",
    "For each item copy the exact source wording into sourceText.",
    settings.detectKeys
      ? "For multiple choice, set correctOption to the zero-based index of the answer marked in the file. Leave it -1 when no answer is marked."
      : "Leave correctOption as -1.",
    settings.writeTests
      ? "For coding items, include test cases: fromExample true for examples stated in the file, otherwise false. Make the first two visible and the rest hidden."
      : "Do not write test cases.",
    "When part of the file is blurry, unclear or ambiguous, add a short checkNote explaining what the instructor should confirm.",
    "Also return a short title for the whole sheet and any general instructions.",
  ].join("\n");
}
