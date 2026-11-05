import { Button } from "@/components/ui/button";
import type {
  WorkspaceItem,
  TestRunResult,
} from "@/components/features/assignments/types";
import { cn } from "@/lib/utils";
type Props = {
  items: WorkspaceItem[];
  activeId: string;
  results: Record<string, TestRunResult[] | null>;
  disabled: boolean;
  submitted: boolean;
  onSelect: (id: string) => void;
};
export function ItemStrip({
  items,
  activeId,
  results,
  disabled,
  submitted,
  onSelect,
}: Props) {
  const done = items.filter(
    (i) => !!results[i.id]?.length && results[i.id]!.every((r) => r.passed),
  ).length;
  return (
    <nav
      aria-label="Post Items"
      className="flex shrink-0 items-center gap-2 overflow-x-auto border-b border-pace-line bg-pace-canvas px-4 py-2 lg:pr-6"
    >
      {items.map((item, index) => (
        <Button
          key={item.id}
          variant="ghost"
          disabled={disabled}
          onClick={() => onSelect(item.id)}
          aria-current={activeId === item.id ? "step" : undefined}
          className={cn(
            "h-auto gap-2 rounded-[18px] border-[1.5px] border-transparent py-1.5 pl-2 pr-3.5 text-[13px] font-normal",
            activeId === item.id && "border-pace-green bg-white font-bold",
          )}
        >
          <span
            className={cn(
              "flex size-6 items-center justify-center rounded-full border-[1.5px] border-pace-line-strong bg-white text-[11px] text-pace-muted",
              activeId === item.id &&
                "border-2 border-pace-green bg-pace-green-tint text-pace-green-deep",
              submitted && "border-pace-green bg-pace-green text-white",
            )}
          >
            {submitted ? "✓" : index + 1}
          </span>
          {item.title}
          <span className="text-[11px] font-bold uppercase tracking-[0.66px] text-pace-muted">
            Coding
          </span>
        </Button>
      ))}
      <span className="ml-auto hidden shrink-0 pl-4 text-[13px] font-bold text-pace-ink-2 lg:inline">
        {submitted ? items.length : done} of {items.length} done
        {done === items.length && !submitted ? " · ready to turn in" : ""}
      </span>
    </nav>
  );
}
