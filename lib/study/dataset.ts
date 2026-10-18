import type { ConstructId } from "./questionnaire";

export type StudyRole = "student" | "instructor";

export type Respondent = {
  id: string;
  role: StudyRole;
  submittedAt: string;
  answers: Record<ConstructId, number[]>;
};

export type StudyComment = {
  respondentId: string;
  role: StudyRole;
  themeId: string;
  text: string;
};

export type StudyDataset = {
  respondents: Respondent[];
  comments: StudyComment[];
  instructorTarget: number;
  studentTarget: number;
};
