export type ImportKind = "coding" | "multiple_choice" | "short_answer";

export interface ImportSettings {
  language: string;
  kinds: "auto" | ImportKind;
  writeTests: boolean;
  detectKeys: boolean;
}

export interface ImportedTestCase {
  input: string;
  expectedOutput: string;
  visible: boolean;
  fromAi: boolean;
}

export interface ImportedItem {
  key: string;
  kind: ImportKind;
  title: string;
  instructions: string;
  points: number;
  language: string;
  starterCode: string;
  options: string[];
  correctOption: number;
  testCases: ImportedTestCase[];
  fromFile: boolean;
  checkNote: string | null;
  sourceText: string;
}

export interface ExtractedDraft {
  title: string;
  instructions: string;
  fileName: string;
  pages: number | null;
  items: ImportedItem[];
  dropped: number;
}

export const IMPORT_LANGUAGES = ["Python", "C", "JavaScript", "C#"];
