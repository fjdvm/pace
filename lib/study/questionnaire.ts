import { instructorItems } from "./items/instructor";
import { studentItems } from "./items/student";
import type { StudyRole } from "./items/types";

export type ConstructId = "PU" | "PEOU" | "ATU" | "BI";

export const ITEMS_PER_CONSTRUCT = 5;

const CONSTRUCT_NAMES: Record<ConstructId, string> = {
  PU: "Perceived usefulness",
  PEOU: "Perceived ease of use",
  ATU: "Attitude toward use",
  BI: "Intention to use",
};

const CONSTRUCT_IDS = Object.keys(CONSTRUCT_NAMES) as ConstructId[];

export const ROLE_ITEMS: Record<StudyRole, typeof studentItems> = {
  student: studentItems,
  instructor: instructorItems,
};

export const CONSTRUCTS: { id: ConstructId; name: string; items: string[] }[] = CONSTRUCT_IDS.map((id, index) => ({
  id,
  name: CONSTRUCT_NAMES[id],
  items: studentItems.acceptability[index].items.map((item) => item.text),
}));

export function constructItemTexts(role: StudyRole, id: ConstructId) {
  return ROLE_ITEMS[role].acceptability[CONSTRUCT_IDS.indexOf(id)].items.map((item) => item.text);
}

export const LIKERT_LABELS = ["Strongly disagree", "Disagree", "Neutral", "Agree", "Strongly agree"];
export const FREQUENCY_LABELS = ["Never", "Rarely", "Sometimes", "Often", "Always"];

export type QuestionnaireVersion = StudyRole;

export const COMMENT_PROMPTS = [
  { id: "helpful", short: "Most helpful", label: "What did you find most helpful about PACE?" },
  {
    id: "problems",
    short: "Problems",
    label:
      "What problems or difficulties did you encounter while using PACE (for example, with the editor, test cases, AI tutor, hearts, or submission)?",
  },
  {
    id: "improve",
    short: "Improvements",
    label: "What specific features would you add or change to make PACE more useful than your current workflow, and why?",
  },
] as const;

export type CommentPromptId = (typeof COMMENT_PROMPTS)[number]["id"];

export const SCALE_CUTOFF = 0.7;
export const POPULATION = 652;
export const MARGIN_OF_ERROR = 0.05;
export const PILOT_SIZE = 30;
