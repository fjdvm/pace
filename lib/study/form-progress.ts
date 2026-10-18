import { CONSTRUCTS, ITEMS_PER_CONSTRUCT, type ConstructId, type QuestionnaireVersion } from "./questionnaire";

export type RatingAnswers = Record<ConstructId, (number | null)[]>;
export type AboutYou = { yearLevel: string; coursesTaken: string; aiUsage: string };
export type StepState = "done" | "current" | "todo";

export const TOTAL_STATEMENTS = CONSTRUCTS.length * ITEMS_PER_CONSTRUCT;

export function emptyAnswers(): RatingAnswers {
  return Object.fromEntries(CONSTRUCTS.map((c) => [c.id, Array(ITEMS_PER_CONSTRUCT).fill(null)])) as RatingAnswers;
}

export function countAnswered(answers: RatingAnswers) {
  return Object.values(answers).reduce((sum, values) => sum + values.filter((v) => v !== null).length, 0);
}

export function aboutYouComplete(version: QuestionnaireVersion, about: AboutYou) {
  if (!about.aiUsage) return false;
  return version === "instructor" || (!!about.yearLevel && !!about.coursesTaken);
}

export function stepStates(aboutDone: boolean, answered: number, total: number): StepState[] {
  if (!aboutDone) return ["current", "todo", "todo"];
  if (answered < total) return ["done", "current", "todo"];
  return ["done", "done", "current"];
}
