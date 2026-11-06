import type { CommentPromptId, ConstructId } from "./questionnaire";
import type { ThemeDef } from "./themes";

export type StudyRole = "student" | "instructor";

export type RespondentProfile = {
  yearLevel: string | null;
  coursesTaken: string | null;
  aiUsage: string | null;
  yearsTeaching?: string | null;
  coursesHandled?: string | null;
  allowsAi?: string | null;
};

export type Respondent = {
  id: string;
  role: StudyRole;
  submittedAt: string;
  answers: Record<ConstructId, number[]>;
  profile?: RespondentProfile;
};

export type StudyComment = {
  key: string;
  respondentId: string;
  role: StudyRole;
  yearLevel: string | null;
  promptId: CommentPromptId;
  themeIds: string[];
  text: string;
};

export type StudyDataset = {
  respondents: Respondent[];
  comments: StudyComment[];
  themes: ThemeDef[];
  instructorTarget: number;
  studentTarget: number;
};
