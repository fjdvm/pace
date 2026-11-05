import type { ReactNode } from "react";
import { PaceTag } from "@/components/features/student/shared/pace-tag";
import { itemKindLabel, itemKindTone } from "@/lib/items/presentation";
import type { useWorkspace } from "./use-workspace";

export function PostItemHeader({
  ws,
  children,
}: {
  ws: ReturnType<typeof useWorkspace>;
  children?: ReactNode;
}) {
  const index = ws.items.findIndex((item) => item.id === ws.activeId);
  return (
    <div className="hidden shrink-0 items-center justify-between gap-3 border-b border-pace-line px-6 py-3.5 leading-[1.35] lg:flex">
      <div className="min-w-0 flex-1">
        <p className="text-[11px] font-bold uppercase leading-[1.3] tracking-[.66px] text-pace-muted">
          Item {index + 1} of {ws.items.length}
        </p>
        <b className="text-base">{ws.activeItem.title}</b>
      </div>
      <PaceTag tone={itemKindTone(ws.activeItem.kind)}>
        {itemKindLabel(ws.activeItem.kind)} · {ws.activeItem.points} pts
      </PaceTag>
      {children}
    </div>
  );
}
