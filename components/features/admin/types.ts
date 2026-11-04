import type { StatusItem } from "@/lib/system-status";

export type AdminOverviewData = {
  counts: { students: number; instructors: number; submissionsThisWeek: number; tutorQuestionsThisWeek: number };
  status: StatusItem[];
  operational: boolean;
};
