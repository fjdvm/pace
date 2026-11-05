"use client";

import { useRef } from "react";
import { Button } from "@/components/ui/button";
import type { editor } from "monaco-editor";
import Editor, { type BeforeMount, type OnMount } from "@monaco-editor/react";
import { PaceTag } from "@/components/features/student/shared/pace-tag";
import type { TestRunResult } from "@/components/features/assignments/types";
import { ConsolePanel } from "./console-panel";

const MONACO_LANGUAGE_MAP: Record<string, string> = {
  Python: "python",
  C: "c",
  JavaScript: "javascript",
  "C#": "csharp",
};

const FILE_EXTENSIONS: Record<string, string> = {
  Python: "py",
  C: "c",
  JavaScript: "js",
  "C#": "cs",
};

const defineTheme: BeforeMount = (monaco) => {
  const theme: editor.IStandaloneThemeData = {
    base: "vs",
    inherit: true,
    rules: [
      { token: "comment", foreground: "8a8a85" },
      { token: "keyword", foreground: "8b5cf6" },
      { token: "predefined", foreground: "5b7cfa" },
    ],
    colors: {
      "editor.background": "#ffffff",
      "editor.lineHighlightBackground": "#ffffff",
      "editorLineNumber.foreground": "#8a8a85",
      "editorLineNumber.activeForeground": "#141414",
    },
  };
  monaco.editor.defineTheme("pace-light", theme);
  monaco.editor.defineTheme("pace-canvas", { ...theme, colors: { ...theme.colors, "editor.background": "#f6f5f1" } });
};

type EditorPanelProps = {
  compact?: boolean;
  itemId?: string;
  language: string;
  mobile?: boolean;
  code: string;
  isSubmitted: boolean;
  runResults: TestRunResult[] | null;
  ranAt: number | null;
  consoleOutput: string;
  onCodeChange: (value: string | undefined) => void;
  onEditorMount: OnMount;
};

export function EditorPanel(props: EditorPanelProps) {
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const ext = FILE_EXTENSIONS[props.language] ?? "txt";
  return (
    <div className="flex h-full w-full min-w-0 flex-col bg-white">
      {!props.compact && <div className="flex shrink-0 items-center gap-2 border-b border-pace-line bg-white px-4 py-2.5 text-[13px] leading-[22px]">
        <span className="font-mono font-bold text-pace-ink">main.{ext}</span>
        <PaceTag tone="neutral">
          {props.language === "Python" ? "Python 3" : props.language}
        </PaceTag>
      </div>}
      <div className="min-h-0 flex-1">
        <Editor
          path={props.itemId ? `${props.itemId}/main.${ext}` : undefined}
          height="100%"
          language={MONACO_LANGUAGE_MAP[props.language]}
          theme={props.compact ? "pace-canvas" : "pace-light"}
          beforeMount={defineTheme}
          value={props.code}
          onChange={props.onCodeChange}
          onMount={(instance, monaco) => {
            editorRef.current = instance;
            props.onEditorMount(instance, monaco);
          }}
          options={{
            minimap: { enabled: false },
            fontSize: 13,
            lineHeight: props.mobile ? 29 : 27.5,
            fontFamily: "var(--font-mono, monospace)",
            automaticLayout: true,
            padding: { top: 16, bottom: 12 },
            lineNumbers: "on",
            lineNumbersMinChars: 2,
            glyphMargin: false,
            folding: false,
            renderLineHighlight: "none",
            guides: { indentation: false },
            overviewRulerLanes: 0,
            hideCursorInOverviewRuler: true,
            scrollBeyondLastLine: false,
            tabSize: 4,
            cursorBlinking: "smooth",
            readOnly: props.isSubmitted,
          }}
        />
      </div>
      {!props.mobile && !props.compact && (
        <div className="h-[250px] shrink-0">
          <ConsolePanel
            results={props.runResults}
            ranAt={props.ranAt}
            output={props.consoleOutput}
            isSubmitted={props.isSubmitted}
          />
        </div>
      )}
      {props.mobile && (
        <div className="flex shrink-0 gap-2 bg-pace-canvas px-3 py-2">
          {["Tab", "(", ")", ":", "=", '\"', "+"].map((key) => (
            <Button
              key={key}
              variant="ghost"
              disabled={props.isSubmitted}
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => {
                const instance = editorRef.current;
                const selection = instance?.getSelection();
                if (instance && selection) {
                  instance.executeEdits("keyboard", [
                    { range: selection, text: key === "Tab" ? "    " : key },
                  ]);
                  instance.focus();
                }
              }}
              className="h-auto rounded-md bg-white px-3 py-1.5 font-mono text-[13px] font-normal"
            >
              {key}
            </Button>
          ))}
        </div>
      )}
    </div>
  );
}
