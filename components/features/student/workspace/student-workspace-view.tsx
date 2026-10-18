"use client";

import type { WorkspaceViewProps } from "@/components/features/assignments/types";
import { WorkspaceTopBar } from "./workspace-top-bar";
import { InstructionsPanel } from "./instructions-panel";
import { EditorPanel } from "./editor-panel";
import { TutorPanel } from "./tutor-panel";
import { ResultModal } from "./result-modal";
import { useWorkspace } from "./use-workspace";

export function StudentWorkspaceView(props: WorkspaceViewProps) {
  const { assignment } = props;
  const ws = useWorkspace(props);
  const backHref = `/dashboard/student/classes/${props.classId}`;
  const results = ws.runResults ?? [];
  const passed = results.filter((r) => r.passed).length;

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-white text-pace-ink">
      <WorkspaceTopBar
        className={props.className}
        title={assignment.title}
        language={assignment.language}
        dueDate={assignment.dueDate}
        backHref={backHref}
        autosaveStatus={ws.autosaveStatus}
        isSubmitted={!!ws.submission}
        isRunning={ws.isRunning}
        isSubmitting={ws.isSubmitting}
        onRun={ws.handleRun}
        onSubmit={ws.handleSubmit}
      />
      <div className="flex min-h-0 flex-1 flex-col overflow-y-auto lg:flex-row lg:overflow-hidden">
        <div className="shrink-0 lg:h-full lg:w-[340px]">
          <InstructionsPanel
            instructions={assignment.instructions}
            testCases={props.visibleTestCases}
            results={ws.runResults}
            hiddenCount={props.hiddenTestCount}
          />
        </div>
        <div className="h-[560px] min-w-0 shrink-0 lg:h-full lg:flex-1">
          <EditorPanel
            language={assignment.language}
            code={ws.code}
            isSubmitted={!!ws.submission}
            runResults={ws.runResults}
            ranAt={ws.ranAt}
            consoleOutput={ws.consoleOutput}
            onCodeChange={ws.handleCodeChange}
            onEditorMount={ws.handleEditorMount}
          />
        </div>
        <div className="h-[640px] shrink-0 lg:h-full lg:w-[400px]">
          <TutorPanel
            messages={ws.chatMessages}
            isLoading={ws.isLoading}
            isStreaming={ws.isStreaming}
            isSubmitted={!!ws.submission}
            hearts={ws.hearts.currentCount}
            maxHearts={assignment.heartsCount}
            heartsSpent={ws.hearts.totalSpent}
            timeToRegen={ws.timeToRegen}
            chatInput={ws.chatInput}
            onChatInputChange={ws.setChatInput}
            onSend={ws.sendToTutor}
          />
        </div>
      </div>
      <ResultModal
        open={ws.resultOpen}
        onClose={() => ws.setResultOpen(false)}
        score={ws.submission?.score ?? 0}
        passed={passed}
        total={results.length}
        reward={ws.reward}
        backHref={backHref}
      />
    </div>
  );
}
