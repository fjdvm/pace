import type { StatusItem } from "@/lib/system-status";

export type InstructorRequest = {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  status: string;
};

export type AdminOverviewData = {
  counts: { students: number; instructors: number; submissionsThisWeek: number; tutorQuestionsThisWeek: number };
  pending: InstructorRequest[];
  status: StatusItem[];
  operational: boolean;
};
