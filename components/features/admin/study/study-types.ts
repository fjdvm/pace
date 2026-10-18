import type { StudyResults } from "@/lib/study/analysis";
import type { StudyRole } from "@/lib/study/dataset";

export type StudyViewData = {
  results: StudyResults;
  closedAt: string | null;
  isSample: boolean;
  respondents: { id: string; role: StudyRole; submittedAt: string }[];
  comments: { respondentId: string; role: StudyRole; themeId: string; text: string }[];
};

export type StudyTab = "overview" | "items" | "comments" | "respondents";
