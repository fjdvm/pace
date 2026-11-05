import Link from "next/link";
import { PaceTag } from "@/components/features/student/shared/pace-tag";
import { itemStatusLabel } from "./item-status";
import type { AssignmentItem } from "./types";

type ItemRowProps = {
  item: AssignmentItem;
  index: number;
  href: string;
};

export function ItemRow({ item, index, href }: ItemRowProps) {
  return (
    <li className="relative flex items-center gap-3 border-t border-pace-line px-3.5 py-3 first:border-t-0">
      <span
        className={`flex size-[26px] shrink-0 items-center justify-center rounded-full text-[11px] font-bold uppercase tracking-[0.66px] ${item.status === "submitted" ? "bg-pace-green text-white" : "border-[1.5px] border-pace-line-strong bg-white text-pace-muted"}`}
      >
        {item.status === "submitted" ? "✓" : index + 1}
      </span>
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <Link
          href={href}
          className="truncate text-[15px] font-bold leading-[1.55] text-pace-ink after:absolute after:inset-0 after:content-['']"
        >
          Item {index + 1} · {item.title}
        </Link>
        <span
          className={`text-[13px] ${item.status === "submitted" ? "text-pace-green-deep" : "text-pace-muted"}`}
        >
          {item.status === "submitted"
            ? (item.kind === "multiple_choice" ? "Answer turned in" : `${item.passed}/${item.tests} tests pass`)
            : `${item.kind === "multiple_choice" ? "Multiple choice" : "Coding"} · ${itemStatusLabel(item.status)}`}
        </span>
      </div>
      <PaceTag tone={item.kind === "multiple_choice" ? "green" : "blue"}>{item.kind === "multiple_choice" ? "Multiple choice" : "Coding"}</PaceTag>
      <span className="shrink-0 text-[13px] font-bold text-pace-ink-2">
        {item.grade != null
          ? `${item.grade}/${item.points}`
          : `${item.points ?? 100} pts`}
      </span>
    </li>
  );
}
