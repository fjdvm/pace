import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { PaceTag } from "@/components/features/student/shared/pace-tag";
import { itemKindLabel, itemKindTone } from "@/lib/items/presentation";
import { PostWorkspaceFrame } from "./post-workspace-frame";
import type { useWorkspace } from "./use-workspace";

type Props = {
  ws: ReturnType<typeof useWorkspace>;
  title: string;
  instructions: string;
  instructor: string;
  className: string;
  classId: string;
  onBack: () => void;
};
export function PostOverview({
  ws,
  title,
  instructions,
  instructor,
  ...frame
}: Props) {
  const next =
    ws.items.find((item) => ws.statuses[item.id] === "in-progress") ??
    ws.items.find((item) => ws.statuses[item.id] !== "answered") ??
    ws.items[0];
  const index = ws.items.indexOf(next);
  const total = ws.items.reduce((sum, item) => sum + item.points, 0);
  return (
    <PostWorkspaceFrame ws={ws} title={title} {...frame} overview>
      <main className="mx-auto flex w-full max-w-[880px] flex-1 flex-col gap-2.5 overflow-y-auto px-4 pt-3.5 lg:gap-4 lg:px-0 lg:pt-8">
        <div className="hidden items-center gap-4 lg:flex">
          <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-pace-green text-[13px] font-bold text-white">
            {"</>"}
          </span>
          <div className="min-w-0 flex-1">
            <h1 className="text-[22px] font-bold leading-[1.25] tracking-[-.22px] text-pace-green-deep">
              {title}
            </h1>
            <p className="mt-0.5 text-[13px] text-pace-muted">
              {instructor} · Due{" "}
              {new Date(ws.dueDate).toLocaleString("en-US", {
                month: "short",
                day: "numeric",
                hour: "numeric",
                minute: "2-digit",
              })}{" "}
              · {total} points
            </p>
          </div>
          <PaceTag tone="amber">
            {ws.done} of {ws.items.length} done
          </PaceTag>
        </div>
        <Progress
          value={(ws.done / ws.items.length) * 100}
          aria-label="Items answered"
          className="h-1.5 lg:h-2 [&_[data-slot=progress-track]]:h-full [&_[data-slot=progress-track]]:bg-pace-sunken [&_[data-slot=progress-indicator]]:bg-pace-green"
        />
        <p className="hidden whitespace-pre-wrap text-[15px] leading-[1.55] text-pace-ink-2 lg:block">
          {instructions ||
            "Answer all items. You can do the items in any order; your work saves as you go."}
        </p>
        <ol className="flex flex-col gap-2.5 lg:gap-0 lg:overflow-hidden lg:rounded-[12px] lg:border lg:border-pace-line">
          {ws.items.map((item, n) => {
            const status = ws.statuses[item.id];
            const results = ws.itemResults[item.id];
            const summary = results?.length
              ? `${results.filter((r) => r.passed).length}/${results.length} tests passed`
              : status === "answered"
                ? "Answered"
                : status === "in-progress"
                  ? "In progress"
                  : "Not answered";
            return (
              <li key={item.id}>
                <Button
                  variant="ghost"
                  onClick={() => ws.setActiveId(item.id)}
                  className={`h-auto w-full justify-start gap-3 whitespace-normal rounded-[12px] border border-pace-line p-3.5 text-left lg:gap-3.5 lg:rounded-none lg:border-0 lg:border-t lg:px-4 lg:py-3.5 ${n === 0 ? "lg:border-t-0" : ""} ${item.id === next.id && status === "in-progress" ? "border-pace-green bg-pace-green-tint" : ""}`}
                >
                  <span
                    className={`flex size-7 shrink-0 items-center justify-center rounded-full border-2 text-[11px] font-bold ${status === "answered" ? "border-pace-green bg-pace-green text-white" : status === "in-progress" ? "border-pace-green text-pace-green-deep" : "border-pace-line-strong text-pace-muted"}`}
                  >
                    {status === "answered" ? "✓" : n + 1}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[15px] font-bold leading-[1.55]">
                      <span className="hidden lg:inline">Item {n + 1} · </span>
                      {item.title}
                    </span>
                    <span
                      className={`hidden text-[13px] font-normal leading-[1.5] lg:block ${status === "answered" ? "text-pace-green-deep" : "text-pace-muted"}`}
                    >
                      {summary}
                    </span>
                    <span className="block text-[11px] font-bold uppercase leading-[1.3] tracking-[.66px] text-pace-muted lg:hidden">
                      {itemKindLabel(item.kind)} · {item.points} pts · {summary}
                    </span>
                  </span>
                  <span className="hidden lg:block">
                    <PaceTag tone={itemKindTone(item.kind)}>
                      {itemKindLabel(item.kind)}
                    </PaceTag>
                  </span>
                  <span className="hidden text-[13px] font-bold text-pace-ink-2 lg:block">
                    {item.points} pts
                  </span>
                  <span className="text-base font-bold text-pace-muted">›</span>
                </Button>
              </li>
            );
          })}
        </ol>
        <div className="hidden items-center justify-end gap-3 lg:flex">
          <p className="text-[13px] text-pace-muted">
            {ws.done === ws.items.length
              ? "All items answered · ready to turn in"
              : "Your work saves as you go. Turn in once for the whole Post."}
          </p>
          <Button
            onClick={() => ws.setActiveId(next.id)}
            className="h-[52px] rounded-full bg-pace-green px-7 text-[15px] font-bold text-white shadow-[0_3px_0_#11923a]"
          >
            {ws.statuses[next.id] === "in-progress" ? "Continue" : "Start"} item{" "}
            {index + 1}
          </Button>
          <Button
            variant="outline"
            onClick={() => ws.setConfirmOpen(true)}
            disabled={!!ws.submission}
          >
            Turn in
          </Button>
        </div>
      </main>
      <footer className="flex gap-3 border-t border-pace-line px-4 pb-7 pt-3 lg:hidden">
        <Button
          variant="outline"
          onClick={() => ws.setActiveId(next.id)}
          className="h-[52px] flex-1 rounded-full text-[15px] font-bold shadow-[0_3px_0_#d6d3cb]"
        >
          Continue
        </Button>
        <Button
          onClick={() => ws.setConfirmOpen(true)}
          disabled={!!ws.submission}
          className="h-[52px] flex-1 rounded-full bg-pace-green text-[15px] font-bold text-white shadow-[0_3px_0_#11923a]"
        >
          Turn in
        </Button>
      </footer>
    </PostWorkspaceFrame>
  );
}
