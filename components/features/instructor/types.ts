export type InstructorClassSummary = {
  id: string;
  name: string;
  joinCode: string;
  studentCount: number;
};

export type InstructorAssignmentRow = {
  id: string;
  title: string;
  language: string;
  dueDate: string;
  classes: { id: string; name: string }[];
  submittedCount: number;
  totalStudents: number;
  averageScore: number | null;
  heartsCount: number;
  heartsRegenMinutes: number;
};

export type InstructorHomeData = {
  greetingName: string;
  classes: InstructorClassSummary[];
  studentCount: number;
  stats: { newSubmissions: number; dueThisWeek: number; flagged: number };
  assignments: InstructorAssignmentRow[];
};
