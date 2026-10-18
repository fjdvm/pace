import type { StudyResults } from "@/lib/study/analysis";
import type { RespondentProfile, StudyComment, StudyRole } from "@/lib/study/dataset";

export type StudyViewData = {
  results: StudyResults;
  closedAt: string | null;
  questionnairePath: string;
  respondents: { id: string; role: StudyRole; submittedAt: string; profile?: RespondentProfile }[];
  comments: StudyComment[];
};

export type StudyTab = "overview" | "items" | "comments" | "respondents";
