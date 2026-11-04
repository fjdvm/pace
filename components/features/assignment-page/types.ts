import type { CommentData } from "@/components/features/classes/types";

export type ItemStatus = "not-started" | "in-progress" | "submitted";

export type AssignmentItem = {
  id: string;
  title: string;
  kind: "coding";
  status: ItemStatus;
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
  instructions: string;
  language: string;
  dueDate: string;
  postedAt: string;
  instructorName: string;
  heartsLeft: number;
  heartsMax: number;
  items: AssignmentItem[];
  comments: AssignmentCommentsData | null;
};
