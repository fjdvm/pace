import { itemComplete } from "./item-completion";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ChoiceOptions } from "./choice-options";
import type { useWorkspace } from "./use-workspace";

type Props = {
  ws: ReturnType<typeof useWorkspace>;
  title: string;
  className: string;
  onBack: () => void;
};
export function ChoiceWorkspace({ ws, title, className, onBack }: Props) {
  const index = ws.items.findIndex((item) => item.id === ws.activeId);
  const done = ws.items.filter((item) =>
    item.kind === "multiple_choice"
      ? ws.codes[item.id] !== ""
      : itemComplete(ws.itemResults[item.id]),
  ).length;
  const navigation = (mobile: boolean) => (
    <>
      <Button
        variant="outline"
        disabled={index === 0 || ws.isSubmitting}
        onClick={() => ws.setActiveId(ws.items[index - 1].id)}
        className={`rounded-full border-pace-line-strong bg-white font-bold shadow-[0_3px_0_#d6d3cb] ${mobile ? "h-[52px] flex-1" : "h-10"}`}
      >
        ‹ Item {index}
      </Button>
      <span className="hidden flex-1 text-right text-[13px] text-pace-muted lg:block">
        {done} of {ws.items.length} done
      </span>
      {index < ws.items.length - 1 && (
        <Button
          variant={mobile ? "default" : "outline"}
          disabled={ws.isSubmitting}
          onClick={() => ws.setActiveId(ws.items[index + 1].id)}
          className={`rounded-full font-bold ${mobile ? "h-[52px] flex-1 bg-pace-green text-white" : "h-10 bg-white"}`}
        >
          Item {index + 2} ›
        </Button>
      )}
      {(!mobile || index === ws.items.length - 1) && (
        <Button
          disabled={!!ws.submission || ws.isSubmitting}
          onClick={() => ws.setConfirmOpen(true)}
          className="h-10 rounded-full bg-pace-green text-white"
        >
          Turn in
        </Button>
      )}
    </>
  );
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <header className="flex h-[52px] shrink-0 items-center gap-2 border-b border-pace-line px-4 lg:h-16">
        <Button
          variant="ghost"
          size="icon"
          onClick={onBack}
          aria-label="Back to Class"
        >
          <Image
            src="/student/workspace/back.svg"
            alt=""
            width={24}
            height={24}
          />
        </Button>
        <div className="lg:hidden">
          <b>
            Item {index + 1} of {ws.items.length}
          </b>
          <p className="text-[11px] font-bold uppercase tracking-[.66px] text-pace-muted">
            Multiple choice · {ws.activeItem.points} pts
          </p>
        </div>
        <span className="hidden font-[family-name:var(--font-funnel)] text-[28px] lg:inline">
          Pace
        </span>
        <span className="hidden text-lg lg:inline">› {className}</span>
      </header>
      <div className="flex min-h-0 flex-1">
        <aside className="hidden w-[280px] shrink-0 flex-col gap-1 border-r border-pace-line bg-pace-canvas px-3 pt-4 lg:flex">
          <p className="mb-1 text-[11px] font-bold uppercase tracking-[.66px] text-pace-muted">
            {title} · {ws.items.length} items
          </p>
          {ws.items.map((item, n) => (
            <Button
              key={item.id}
              variant="ghost"
              onClick={() => ws.setActiveId(item.id)}
              disabled={ws.isSubmitting}
              className={`h-auto justify-start whitespace-normal rounded-lg p-2.5 text-left ${item.id === ws.activeId ? "border border-pace-line bg-white" : ""}`}
            >
              <span className="flex size-6 shrink-0 items-center justify-center rounded-full border-2 border-pace-line-strong text-[11px]">
                {n + 1}
              </span>
              <span className="min-w-0">
                <span className="block text-[13px]">{item.title}</span>
                <span className="text-[11px] uppercase text-pace-muted">
                  {item.kind === "multiple_choice"
                    ? "Multiple choice"
                    : "Coding"}{" "}
                  · {item.points} pts
                </span>
              </span>
            </Button>
          ))}
        </aside>
        <div className="flex min-w-0 flex-1 flex-col">
          <div className="hidden items-center justify-between border-b border-pace-line px-6 py-3.5 lg:flex">
            <div>
              <p className="text-[11px] font-bold uppercase text-pace-muted">
                Item {index + 1} of {ws.items.length}
              </p>
              <b>{ws.activeItem.title}</b>
            </div>
            <span className="rounded-full bg-pace-green-tint px-2.5 py-1 text-xs font-bold text-pace-green-deep">
              Multiple choice · {ws.activeItem.points} pts
            </span>
          </div>
          <nav aria-label="Items" className="flex gap-1.5 px-4 pt-3 lg:hidden">
            {ws.items.map((item, n) => (
              <Button
                key={item.id}
                variant="outline"
                onClick={() => ws.setActiveId(item.id)}
                className={`size-6 rounded-full p-0 text-[11px] ${item.id === ws.activeId ? "border-pace-green bg-pace-green-tint text-pace-green-deep" : ""}`}
              >
                {n + 1}
              </Button>
            ))}
          </nav>
          <main className="flex-1 overflow-y-auto px-4 pt-4 lg:px-12 lg:pt-8">
            <h1 className="mb-2.5 text-[22px] font-bold leading-[1.25] tracking-[-.22px]">
              {ws.activeItem.title}
            </h1>
            <p className="mb-2.5 text-[13px] text-pace-muted lg:mb-3">
              Choose one answer.
            </p>
            <ChoiceOptions
              options={ws.activeItem.options ?? []}
              value={ws.code}
              disabled={!!ws.submission || ws.isSubmitting}
              onChange={ws.handleCodeChange}
            />
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
              <span className="hidden lg:inline">
                {" "}
                · You can change your answer until you turn in.
              </span>
            </p>
          </main>
          <footer className="flex gap-3 border-t border-pace-line px-4 pb-7 pt-3 lg:hidden">
            {navigation(true)}
          </footer>
          <footer className="hidden items-center gap-3 border-t border-pace-line px-6 py-3 lg:flex">
            {navigation(false)}
          </footer>
        </div>
      </div>
    </div>
  );
}
