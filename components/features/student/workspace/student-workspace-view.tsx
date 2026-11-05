"use client";

import { JetBrains_Mono } from "next/font/google";
import type { WorkspaceViewProps } from "@/components/features/assignments/types";
import { ChoiceWorkspace } from "./choice-workspace";
import { WorkspaceTopBar } from "./workspace-top-bar";
import { InstructionsPanel } from "./instructions-panel";
import { EditorPanel } from "./editor-panel";
import { TutorPanel } from "./tutor-panel";
import { ResultModal } from "./result-modal";
import { DesktopWorkspaceLayout } from "./desktop-workspace-layout";
import { useMediaQuery } from "@/hooks/use-media-query";
import { TurnInDialog } from "./turn-in-dialog";
import { ItemStrip } from "./item-strip";
import { MobileWorkspace } from "./mobile-workspace";
import { useWorkspace } from "./use-workspace";

const workspaceMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export function StudentWorkspaceView(props: WorkspaceViewProps) {
  const { assignment } = props;
  const ws = useWorkspace(props);
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const backHref = `/dashboard/classes/${props.classId}`;
  const results = Object.values(ws.itemResults).flatMap((r) => r ?? []);
  const passed = results.filter((r) => r.passed).length;

  const instructions = (
    <InstructionsPanel
      instructions={ws.activeItem.instructions}
      testCases={ws.activeItem.testCases}
      results={ws.runResults}
      hiddenCount={ws.activeItem.hiddenTestCount}
    />
  );
  const editor = (
    <EditorPanel
      itemId={ws.activeId}
      language={ws.activeItem.language}
      mobile={!isDesktop}
      code={ws.code}
      isSubmitted={!!ws.submission || ws.isSubmitting || ws.isRunning}
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
      regenMinutes={assignment.heartsRegenMinutes}
      maxHearts={assignment.heartsCount}
      heartsSpent={ws.hearts.totalSpent}
      timeToRegen={ws.timeToRegen}
      refillMinutes={ws.refillMinutes}
      chatInput={ws.chatInput}
      onChatInputChange={ws.setChatInput}
      onSend={ws.sendToTutor}
    />
  );

  return (
    <div
      className={`${workspaceMono.variable} flex h-dvh flex-col overflow-hidden bg-white text-pace-ink`}
    >
      {ws.activeItem.kind === "multiple_choice" ? (
        <ChoiceWorkspace
          ws={ws}
          title={assignment.title}
          className={props.className}
          classId={props.classId}
          onBack={() => ws.leave(backHref)}
        />
      ) : (
        <>
          <WorkspaceTopBar
            items={ws.items}
            activeId={ws.activeId}
            onSelect={ws.setActiveId}
            onBack={() => ws.leave(backHref)}
            title={assignment.title}
            itemTitle={ws.activeItem.title}
            itemIndex={ws.items.findIndex((i) => i.id === ws.activeId)}
            itemCount={ws.items.length}
            dueDate={assignment.dueDate}
            backHref={backHref}
            autosaveStatus={ws.autosaveStatus}
            hearts={ws.hearts.currentCount}
            maxHearts={assignment.heartsCount}
            isSubmitted={!!ws.submission}
            isRunning={ws.isRunning}
            isSubmitting={ws.isSubmitting}
            onRun={ws.handleRun}
            onSubmit={() => ws.setConfirmOpen(true)}
          />
          {isDesktop && (
            <ItemStrip
              items={ws.items}
              activeId={ws.activeId}
              results={ws.itemResults}
              disabled={ws.isRunning || ws.isSubmitting}
              submitted={!!ws.submission}
              onSelect={ws.setActiveId}
            />
          )}
          {isDesktop ? (
            <DesktopWorkspaceLayout
              instructions={instructions}
              editor={editor}
              tutor={tutor}
            />
          ) : (
            <MobileWorkspace
              editor={editor}
              tutor={tutor}
              instructions={instructions}
              results={ws.runResults}
              hiddenCount={ws.activeItem.hiddenTestCount}
              consoleOutput={ws.consoleOutput}
              isRunning={ws.isRunning}
              isSubmitting={ws.isSubmitting}
              isSubmitted={!!ws.submission}
              onRun={ws.handleRun}
              onSubmit={() => ws.setConfirmOpen(true)}
            />
          )}
        </>
      )}
      <TurnInDialog
        open={ws.confirmOpen}
        onOpenChange={ws.setConfirmOpen}
        items={ws.items}
        results={ws.itemResults}
        heartsUsed={ws.hearts.totalSpent}
        maxHearts={assignment.heartsCount}
        busy={ws.isSubmitting}
        onConfirm={ws.handleSubmit}
      />
      <ResultModal
        open={ws.resultOpen}
        onClose={() => ws.setResultOpen(false)}
        score={ws.submission?.score ?? null}
        passed={passed}
        total={results.length}
        reward={ws.reward}
        backHref={backHref}
      />
    </div>
  );
}
