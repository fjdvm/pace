import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ChoiceOptions } from "./choice-options";
import { ChoiceNavigation } from "./choice-navigation";
import { PostWorkspaceFrame } from "./post-workspace-frame";
import { PostItemHeader } from "./post-item-header";
import type { useWorkspace } from "./use-workspace";

type Props = {
  ws: ReturnType<typeof useWorkspace>;
  title: string;
  className: string;
  classId: string;
  onBack: () => void;
};
export function AnswerWorkspace({ ws, ...frame }: Props) {
  const short = ws.activeItem.kind === "short_answer";
  const index = ws.items.findIndex((item) => item.id === ws.activeId);
  return (
    <PostWorkspaceFrame ws={ws} {...frame}>
      <PostItemHeader ws={ws} />
      <nav aria-label="Items" className="flex gap-1.5 px-4 pt-3 lg:hidden">
        {ws.items.map((item, n) => (
          <Button
            key={item.id}
            variant="outline"
            disabled={ws.isSubmitting}
            aria-label={`Item ${n + 1}`}
            onClick={() => ws.setActiveId(item.id)}
            className={`size-6 rounded-full p-0 text-[11px] ${ws.statuses[item.id] === "answered" && item.id !== ws.activeId ? "border-pace-green bg-pace-green text-white" : item.id === ws.activeId ? "border-pace-green bg-pace-green-tint text-pace-green-deep" : ""}`}
          >
            {ws.statuses[item.id] === "answered" && item.id !== ws.activeId
              ? "✓"
              : n + 1}
          </Button>
        ))}
      </nav>
      <main className="flex-1 overflow-y-auto px-4 pt-4 lg:px-12 lg:pt-8">
        <h1 className="mb-2.5 text-[22px] font-bold leading-[1.25] tracking-[-.22px] lg:text-[22px]">
          {ws.activeItem.title}
        </h1>
        <p className="mb-2.5 text-[13px] leading-[1.5] text-pace-muted lg:mb-3">
          {short
            ? "Write your answer. Graded by your Instructor."
            : "Choose one answer."}
        </p>
        {short ? (
          <label className="block space-y-2 text-[13px] font-semibold">
            <span>Your answer</span>
            <Textarea
              value={ws.code}
              disabled={!!ws.submission || ws.isSubmitting}
              onChange={(e) => ws.handleCodeChange(e.target.value)}
              placeholder="Type your answer"
              className="min-h-48 rounded-[12px] border-[1.5px] border-pace-line-strong p-4 text-[15px] font-normal leading-[1.55]"
            />
          </label>
        ) : (
          <ChoiceOptions
            options={ws.activeItem.options ?? []}
            value={ws.code}
            disabled={!!ws.submission || ws.isSubmitting}
            onChange={ws.handleCodeChange}
          />
        )}
        <p
          aria-live="polite"
          className="mt-2.5 text-[11px] font-bold uppercase text-pace-green-deep lg:text-[13px] lg:font-normal lg:normal-case lg:text-pace-muted"
        >
          {ws.submission
            ? "Turned in"
            : ws.autosaveStatus === "error"
              ? "Save failed · change your answer to retry"
              : ws.autosaveStatus === "saving"
                ? "Saving…"
                : "Saved"}
          {!ws.submission && (
            <span className="hidden lg:inline">
              {" "}
              · You can change your answer until you turn in.
            </span>
          )}
        </p>
      </main>

      <footer className="flex gap-3 border-t border-pace-line px-4 pb-7 pt-3 lg:hidden">
        <ChoiceNavigation ws={ws} index={index} mobile />
      </footer>
      <footer className="hidden items-center gap-3 border-t border-pace-line px-6 py-3 lg:flex">
        <ChoiceNavigation ws={ws} index={index} mobile={false} />
      </footer>
    </PostWorkspaceFrame>
  );
}
