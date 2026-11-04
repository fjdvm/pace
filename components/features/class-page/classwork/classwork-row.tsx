import Link from "next/link";
import Image from "next/image";
import { formatDueLong, formatDueShort } from "@/lib/student-dates";
import type { ClassworkItem } from "./types";

type ClassworkRowProps = {
  item: ClassworkItem;
  href: string;
  menu?: React.ReactNode;
};

export function ClassworkRow({ item, href, menu }: ClassworkRowProps) {
  return (
    <div className="relative flex h-16 items-center gap-4 border-b border-pace-line pl-4 pr-2">
      <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-pace-green">
        <Image src="/class/assignment.svg" alt="" width={24} height={24} />
      </span>
      <Link
        href={href}
        className="min-w-0 flex-1 truncate text-[15px] font-bold leading-[1.55] text-pace-ink after:absolute after:inset-0 after:content-['']"
      >
        {item.title}
      </Link>
      <span className="shrink-0 whitespace-nowrap text-[13px] text-pace-muted">
        <span className="md:hidden">{formatDueShort(item.dueDate)}</span>
        <span className="hidden md:inline">Due {formatDueLong(item.dueDate)}</span>
      </span>
      {menu ?? <span className="size-10 shrink-0 md:hidden" aria-hidden />}
    </div>
  );
}
