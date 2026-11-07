import type { RosterInstructor, RosterStudent, StreamPostData } from "@/components/features/classes/types";
import type { StudentAssignment } from "@/components/features/student/types";

export interface InstructorAssignment {
  id: string;
  title: string;
  language: string;
  dueDate: string;
  isDraft?: boolean;
  testCaseCount: number;
  turnedIn: number;
  graded?: number;
  missing?: number;
  assigned: number;
  isSharedWithOtherClasses: boolean;
}

export interface LeaderboardEntry {
  studentId: string;
  email: string;
  name: string | null;
  totalXp: number;
  level: number;
  rank: number;
}

export type ClassPageTab = "stream" | "classwork" | "people" | "grades";

interface ClassPageBase {
  classId: string;
  className: string;
  joinCode: string;
  archived: boolean;
  currentUserId: string;
  posts: StreamPostData[];
  roster: RosterStudent[];
  instructor: RosterInstructor;
  leaderboard: LeaderboardEntry[];
  myRank?: number;
}

export type ClassPageData =
  | (ClassPageBase & {
      role: "instructor";
      assignments: InstructorAssignment[];
    })
  | (ClassPageBase & { role: "student"; assignments: StudentAssignment[] });
