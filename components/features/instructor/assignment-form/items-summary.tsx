import { Badge } from "@/components/ui/badge";
import type { AssignmentFormValues } from "@/lib/assignment-form";

export function ItemsSummary({ values }: { values: AssignmentFormValues }) {
  return (
    <section className="flex flex-col gap-3 rounded-[12px] border border-pace-line bg-white p-6">
      <div className="flex items-center gap-2">
        <h2 className="text-base font-bold">Items</h2>
        <p className="text-[13px] text-pace-muted">
          1 item · {values.points ?? 100} points total
        </p>
      </div>
      <div className="flex items-center gap-3 rounded-[10px] border border-pace-green bg-pace-green-tint p-3">
        <span className="text-[13px] text-pace-muted" aria-hidden>
          ⋮⋮
        </span>
        <span className="flex size-[26px] shrink-0 items-center justify-center rounded-full bg-pace-green text-[11px] font-bold text-white">
          1
        </span>
        <p className="min-w-0 flex-1 truncate text-[15px] font-bold">
          {values.itemTitle ?? (values.title || "Untitled Item")}
        </p>
        <Badge className="rounded-full bg-pace-blue-tint px-2.5 py-1 text-xs text-pace-blue">
          Coding
        </Badge>
        <Badge className="rounded-full bg-pace-green-tint px-2.5 py-1 text-xs text-pace-green-deep">
          Editing
        </Badge>
        <p className="text-[13px] font-bold text-pace-ink-2">
          {values.points ?? 100} pts
        </p>
      </div>
    </section>
  );
}
