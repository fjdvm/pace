import { useState, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { PostWorkspaceFrame } from "./post-workspace-frame";
import { PostItemHeader } from "./post-item-header";
import { ChoiceNavigation } from "./choice-navigation";
import type { useWorkspace } from "./use-workspace";

type Props = {
  ws: ReturnType<typeof useWorkspace>;
  title: string;
  className: string;
  classId: string;
  maxHearts: number;
  editor: ReactNode;
  tutor: ReactNode;
  onBack: () => void;
};
export function MultiCodingWorkspace({
  ws,
  editor,
  tutor,
  maxHearts,
  ...frame
}: Props) {
  const [tutorOpen, setTutorOpen] = useState(false);
  const index = ws.items.findIndex((item) => item.id === ws.activeId);
  const example = ws.activeItem.testCases[0];
  return (
    <PostWorkspaceFrame ws={ws} {...frame}>
      <PostItemHeader ws={ws}>
        <Button
          variant="ghost"
          onClick={() => setTutorOpen(true)}
          className="rounded-full bg-pace-red-tint text-pace-red"
          aria-label="Open AI tutor"
        >
          ♥ {ws.hearts.currentCount}/{maxHearts}
        </Button>
        <Button
          variant="outline"
          disabled={ws.isRunning || ws.isSubmitting || !!ws.submission}
          onClick={ws.handleRun}
          className="h-10 rounded-full border-pace-line-strong px-[18px] font-bold shadow-[0_3px_0_#d6d3cb]"
        >
          {ws.isRunning ? "Running…" : "▶ Run"}
        </Button>
      </PostItemHeader>
      <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
        <section className="flex max-h-[40%] shrink-0 flex-col gap-3 overflow-y-auto border-b border-pace-line px-6 py-5 text-[15px] leading-[1.55] lg:max-h-none lg:w-[360px] lg:border-b-0 lg:border-r">
          <p className="whitespace-pre-wrap">{ws.activeItem.instructions}</p>
          {example && (
            <>
              <p className="text-[11px] font-bold uppercase tracking-[.66px] text-pace-muted">
                Example
              </p>
              <pre className="whitespace-pre-wrap rounded-[8px] bg-pace-canvas p-3 font-mono text-[13px] leading-[1.65]">
                Input: {example.input}
                {"\n"}Output: {example.expectedOutput}
              </pre>
            </>
          )}
          <p className="text-[11px] font-bold uppercase tracking-[.66px] text-pace-muted">
            Tests · {ws.runResults?.filter((r) => r.passed).length ?? 0} of{" "}
            {ws.activeItem.testCases.length} passed
          </p>
          {ws.activeItem.testCases.map((test) => {
            const result = ws.runResults?.find((r) => r.testCaseId === test.id);
            return (
              <div
                key={test.id}
                className="flex items-center gap-2 font-mono text-[13px]"
              >
                <span
                  className={`flex size-[18px] shrink-0 items-center justify-center rounded-full text-[11px] text-white ${!result ? "bg-pace-line-strong" : result.passed ? "bg-pace-green" : "bg-pace-red"}`}
                >
                  {!result ? "?" : result.passed ? "✓" : "✕"}
                </span>
                <span className="whitespace-pre-wrap">
                  {test.input} → {test.expectedOutput}
                </span>
              </div>
            );
          })}
          {ws.activeItem.hiddenTestCount > 0 && (
            <p className="text-[13px] text-pace-muted">
              ? {ws.activeItem.hiddenTestCount} hidden tests
            </p>
          )}
          {ws.consoleOutput && (
            <p role="status" className="whitespace-pre-wrap text-[13px]">
              {ws.consoleOutput}
            </p>
          )}
        </section>
        <div className="min-h-0 min-w-0 flex-1 [&>div]:bg-pace-canvas">
          {editor}
        </div>
      </div>
      <footer className="flex flex-wrap items-center gap-3 border-t border-pace-line px-4 pb-7 pt-3 lg:px-6 lg:py-3">
        <span className="flex gap-2 lg:hidden">
          <Button
            variant="outline"
            disabled={ws.isRunning || !!ws.submission}
            onClick={ws.handleRun}
          >
            Run
          </Button>
          <Button variant="outline" onClick={() => setTutorOpen(true)}>
            AI tutor ♥ {ws.hearts.currentCount}
          </Button>
        </span>
        <ChoiceNavigation ws={ws} index={index} mobile={false} />
      </footer>
      <Sheet open={tutorOpen} onOpenChange={setTutorOpen}>
        <SheetContent className="w-full gap-0 p-0 sm:max-w-[420px]">
          <SheetTitle className="sr-only">AI tutor</SheetTitle>
          {tutor}
        </SheetContent>
      </Sheet>
    </PostWorkspaceFrame>
  );
}
