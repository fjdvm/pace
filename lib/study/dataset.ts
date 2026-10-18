import type { CommentPromptId, ConstructId } from "./questionnaire";

export type StudyRole = "student" | "instructor";

export type RespondentProfile = {
  yearLevel: string | null;
  coursesTaken: string | null;
  aiUsage: string;
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
  promptId: CommentPromptId;
  themeId: string;
  text: string;
};

export type StudyDataset = {
  respondents: Respondent[];
  comments: StudyComment[];
  instructorTarget: number;
  studentTarget: number;
};
