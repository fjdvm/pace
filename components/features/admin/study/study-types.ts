import type { StudyResults } from "@/lib/study/analysis";
import type { RespondentProfile, StudyComment, StudyRole } from "@/lib/study/dataset";
import type { ThemeDef } from "@/lib/study/themes";

export type StudyViewData = {
  results: StudyResults;
  closedAt: string | null;
  questionnairePath: string;
  respondents: { id: string; role: StudyRole; submittedAt: string; profile?: RespondentProfile }[];
  comments: StudyComment[];
  themes: ThemeDef[];
};

export type StudyTab = "overview" | "items" | "comments" | "respondents";
