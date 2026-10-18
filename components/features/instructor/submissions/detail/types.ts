import type { StoredBehavioralSignals } from "@/lib/types/behavioral-signals";

export type DetailTestResult = {
  testCaseId: string;
  input: string;
  expectedOutput: string;
  actualOutput: string;
  passed: boolean;
  visible?: boolean;
};

export type SubmissionDetail = {
  assignment: { id: string; title: string; language: string; heartsCount: number };
  student: { id: string; name: string };
  submittedAt: string | null;
  code: string | null;
  score: number | null;
  testResults: DetailTestResult[];
  signals: StoredBehavioralSignals | null;
  heartsUsed: number;
  minutesOnTask: number | null;
  chat: { role: string; content: string; createdAt: string }[];
  similar: { studentId: string; name: string; similarity: number } | null;
  neighbors: { previousId: string | null; nextId: string | null };
};

export type CompareData = {
  assignment: { id: string; title: string; language: string };
  similarity: number;
  left: { id: string; name: string; code: string };
  right: { id: string; name: string; code: string };
};
