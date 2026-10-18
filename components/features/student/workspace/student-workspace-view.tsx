"use client";

import type { WorkspaceViewProps } from "@/components/features/assignments/types";
import { WorkspaceTopBar } from "./workspace-top-bar";
import { InstructionsPanel } from "./instructions-panel";
import { EditorPanel } from "./editor-panel";
import { TutorPanel } from "./tutor-panel";
import { ResultModal } from "./result-modal";
import { DesktopWorkspaceLayout } from "./desktop-workspace-layout";
import { useMediaQuery } from "@/hooks/use-media-query";
import { useWorkspace } from "./use-workspace";

export function StudentWorkspaceView(props: WorkspaceViewProps) {
  const { assignment } = props;
  const ws = useWorkspace(props);
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const backHref = `/dashboard/student/classes/${props.classId}`;
  const results = ws.runResults ?? [];
  const passed = results.filter((r) => r.passed).length;

  const instructions = (
    <InstructionsPanel
      instructions={assignment.instructions}
      testCases={props.visibleTestCases}
      results={ws.runResults}
      hiddenCount={props.hiddenTestCount}
    />
  );
  const editor = (
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
  );
  const tutor = (
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
  );

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
      {isDesktop ? (
        <DesktopWorkspaceLayout instructions={instructions} editor={editor} tutor={tutor} />
      ) : (
        <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
          <div className="shrink-0">{instructions}</div>
          <div className="h-[560px] min-w-0 shrink-0">{editor}</div>
          <div className="h-[640px] shrink-0">{tutor}</div>
        </div>
      )}
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
