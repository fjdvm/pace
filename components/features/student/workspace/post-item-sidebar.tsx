import { Button } from "@/components/ui/button";
import { itemKindLabel } from "@/lib/items/presentation";
import type { useWorkspace } from "./use-workspace";

export function PostItemSidebar({
  ws,
  title,
}: {
  ws: ReturnType<typeof useWorkspace>;
  title: string;
}) {
  return (
    <nav aria-label="Post Items" className="flex flex-col gap-1">
      <Button
        variant="ghost"
        onClick={() => ws.setOverview(true)}
        className="h-auto justify-start whitespace-normal px-0 text-left text-[11px] font-bold uppercase tracking-[.66px] text-pace-muted"
      >
        {title} · {ws.items.length} items
      </Button>
      {ws.items.map((item, n) => (
        <Button
          key={item.id}
          variant="ghost"
          disabled={ws.isSubmitting || ws.isRunning}
          onClick={() => ws.setActiveId(item.id)}
          aria-current={item.id === ws.activeId ? "step" : undefined}
          className={`h-auto justify-start gap-2.5 whitespace-normal rounded-[8px] border p-2.5 text-left ${item.id === ws.activeId ? "border-pace-line bg-white" : "border-transparent"}`}
        >
          <span
            className={`flex size-6 shrink-0 items-center justify-center rounded-full border-2 text-[11px] ${ws.statuses[item.id] === "answered" ? "border-pace-green bg-pace-green text-white" : item.id === ws.activeId ? "border-pace-green bg-pace-green-tint text-pace-green-deep" : "border-pace-line-strong text-pace-muted"}`}
          >
            {ws.statuses[item.id] === "answered" ? "✓" : n + 1}
          </span>
          <span className="min-w-0">
            <span
              className={`block text-[13px] font-normal ${item.id === ws.activeId ? "font-bold" : ""}`}
            >
              {item.title}
            </span>
            <span className="text-[11px] font-bold uppercase leading-[1.3] tracking-[.66px] text-pace-muted">
              {itemKindLabel(item.kind)} · {item.points} pts
            </span>
          </span>
        </Button>
      ))}
    </nav>
  );
}
