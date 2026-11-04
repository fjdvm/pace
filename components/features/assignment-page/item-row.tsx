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
      <span className="flex size-[26px] shrink-0 items-center justify-center rounded-full border-[1.5px] border-pace-line-strong bg-white text-[11px] font-bold uppercase tracking-[0.66px] text-pace-muted">
        {index + 1}
      </span>
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <Link
          href={href}
          className="truncate text-[15px] font-bold leading-[1.55] text-pace-ink after:absolute after:inset-0 after:content-['']"
        >
          Item {index + 1} · {item.title}
        </Link>
        <span className="text-[13px] text-pace-muted">Coding · {itemStatusLabel(item.status)}</span>
      </div>
      <PaceTag tone="blue">Coding</PaceTag>
    </li>
  );
}
