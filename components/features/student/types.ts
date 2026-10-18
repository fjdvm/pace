export type StudentAssignmentStatus = "not started" | "in progress" | "submitted";

export interface StudentAssignment {
  id: string;
  title: string;
  language: string;
  dueDate: string;
  status: StudentAssignmentStatus;
  classId: string;
  className: string;
  classIndex: number;
  heartsLeft: number;
  heartsMax: number;
  score: number | null;
  submittedAt: string | null;
}

export interface StudentClass {
  id: string;
  name: string;
  instructorEmail: string;
  joinCode: string;
  archived: boolean;
  assignments: StudentAssignment[];
}

export interface StudentHomeData {
  firstName: string;
  classes: StudentClass[];
  activeDays: number[];
  xp: { level: number; currentXp: number; nextThreshold: number };
}
