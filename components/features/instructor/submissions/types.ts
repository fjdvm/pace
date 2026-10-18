import type { FlagTone } from "@/lib/assignment-overview";

export type StudentStatus = "submitted" | "in-progress" | "not-started";

export type SubmissionStudentRow = {
  studentId: string;
  name: string;
  email: string;
  status: StudentStatus;
  score: number | null;
  hearts: number;
  flags: { label: string; tone: FlagTone }[];
  submittedAt: string | null;
};

export type SimilarityPairView = {
  aId: string;
  aName: string;
  bId: string;
  bName: string;
  similarity: number;
};

export type AssignmentOverview = {
  assignment: {
    id: string;
    title: string;
    language: string;
    classCodes: string;
    dueDate: string;
    heartsCount: number;
  };
  students: SubmissionStudentRow[];
  stats: {
    submitted: number;
    total: number;
    average: number | null;
    median: number;
    avgHearts: number;
  };
  insights: {
    bands: { high: number; mid: number; low: number };
    byHearts: { label: string; average: number | null }[];
    mostFailed: { label: string; count: number } | null;
  };
  pairs: SimilarityPairView[];
  narrative: string | null;
};
