import type { CommentData } from "@/components/features/classes/types";

export type ItemStatus = "not-started" | "in-progress" | "submitted";

export type AssignmentItem = {
  id: string;
  title: string;
  kind: "coding" | "multiple_choice";
  status: ItemStatus;
  points?: number;
  grade?: number | null;
  passed?: number;
  tests?: number;
};

export type AssignmentCommentsData = {
  postId: string;
  currentUserId: string;
  instructorId: string;
  instructorName: string;
  classComments: CommentData[];
  privateThread: CommentData[];
};

export type StudentAssignmentData = {
  id: string;
  title: string;
  classId: string;
  className: string;
  instructions: string;
  language: string;
  dueDate: string;
  postedAt: string;
  instructorName: string;
  heartsLeft: number;
  heartsMax: number;
  totalPoints?: number;
  submission?: {
    status: import("@/lib/submission-state").SubmissionStatus;
    submittedAt: string;
    returnedAt: string | null;
    late: boolean;
    grade: number | null;
    feedback: string | null;
    heartsUsed: number;
    visiblePassed: number;
    visibleTotal: number;
  } | null;
  items: AssignmentItem[];
  comments: AssignmentCommentsData | null;
};
