export interface AssignmentData {
  id: string;
  title: string;
  overviewInstructions?: string;
  instructions: string;
  language: string;
  dueDate: string;
  aiTutorEnabled?: boolean;
  tieredHintsEnabled?: boolean;
  monitoringEnabled?: boolean;
  similarityCheckEnabled?: boolean;
  heartsCount: number;
  heartsRegenMinutes: number;
  instructorEmail: string;
}

export interface HeartsStateData {
  currentCount: number;
  lastRegenAt: string;
  totalSpent: number;
}

export interface TestCaseData {
  id: string;
  input: string;
  expectedOutput: string;
}

export interface SubmissionData {
  id: string;
  code: string;
  score: number | null;
  testResults: unknown;
  submittedAt: string;
}

export interface ChatMessageData {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: string;
}

export interface WorkspaceItem {
  kind?: "coding" | "multiple_choice" | "short_answer";
  options?: string[];
  id: string;
  title: string;
  instructions: string;
  language: string;
  starterCode: string;
  points: number;
  testCases: TestCaseData[];
  hiddenTestCount: number;
  code: string | null;
  testResults: TestRunResult[] | null;
}

export interface WorkspaceViewProps {
  initialTutorStates?: Record<string, { hearts: HeartsStateData; messages: ChatMessageData[] }>;
  initialItemId?: string;
  items?: WorkspaceItem[];
  assignment: AssignmentData;
  className: string;
  classId: string;
  hiddenTestCount: number;
  initialHearts: HeartsStateData;
  visibleTestCases: TestCaseData[];
  initialSubmission: SubmissionData | null;
  initialChatMessages: ChatMessageData[];
  initialDraftCode: string | null;
}

export interface TestRunResult {
  testCaseId: string;
  input: string;
  expectedOutput: string;
  actualOutput: string;
  stderr: string;
  compileOutput: string;
  status: { id: number; description: string };
  passed: boolean;
  visible?: boolean;
}
