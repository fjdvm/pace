"use client";

import Editor, { type BeforeMount, type OnMount } from "@monaco-editor/react";
import { PaceIcon } from "@/components/features/student/shared/pace-icon";
import type { TestRunResult } from "@/components/features/assignments/types";
import { ConsolePanel } from "./console-panel";

const MONACO_LANGUAGE_MAP: Record<string, string> = {
  Python: "python",
  C: "c",
  JavaScript: "javascript",
  "C#": "csharp",
};

const FILE_EXTENSIONS: Record<string, string> = { Python: "py", C: "c", JavaScript: "js", "C#": "cs" };

const defineTheme: BeforeMount = (monaco) => {
  monaco.editor.defineTheme("pace-dark", {
    base: "vs-dark",
    inherit: true,
    rules: [],
    colors: {
      "editor.background": "#141414",
      "editor.lineHighlightBackground": "#2a2a27",
      "editorLineNumber.foreground": "#5c5c58",
      "editorLineNumber.activeForeground": "#e8e6e1",
    },
  });
};

type EditorPanelProps = {
  language: string;
  code: string;
  isSubmitted: boolean;
  runResults: TestRunResult[] | null;
  ranAt: number | null;
  consoleOutput: string;
  onCodeChange: (value: string | undefined) => void;
  onEditorMount: OnMount;
};

export function EditorPanel(props: EditorPanelProps) {
  const ext = FILE_EXTENSIONS[props.language] ?? "txt";
  return (
    <div className="flex h-full w-full min-w-0 flex-col bg-pace-ink">
      <div className="flex shrink-0 items-center gap-2 bg-[#1e1e1c] px-4 py-2.5 font-mono text-[13px] leading-[22px]">
        <PaceIcon name="workspace/code-editor" size={14} />
        <span className="text-[#e8e6e1]">main.{ext}</span>
        <span className="flex-1" />
        <span className="text-pace-muted">{props.language}</span>
      </div>
      <div className="min-h-[200px] flex-1">
        <Editor
          height="100%"
          language={MONACO_LANGUAGE_MAP[props.language]}
          theme="pace-dark"
          beforeMount={defineTheme}
          value={props.code}
          onChange={props.onCodeChange}
          onMount={props.onEditorMount}
          options={{
            minimap: { enabled: false },
            fontSize: 13,
            lineHeight: 22,
            fontFamily: "var(--font-mono, monospace)",
            automaticLayout: true,
            padding: { top: 16, bottom: 12 },
            lineNumbers: "on",
            scrollBeyondLastLine: false,
            tabSize: 4,
            cursorBlinking: "smooth",
            readOnly: props.isSubmitted,
          }}
        />
      </div>
      <ConsolePanel
        results={props.runResults}
        ranAt={props.ranAt}
        output={props.consoleOutput}
        isSubmitted={props.isSubmitted}
      />
    </div>
  );
}
