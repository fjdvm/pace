import Link from "next/link";
import Image from "next/image";
import type { StudentAssignment } from "@/components/features/student/types";
import { RowMenu } from "../stream/row-menu";
import { statusLabel } from "./student-work-status";

export function StudentWorkRow({ item }: { item: StudentAssignment }) {
  const href = `/dashboard/assignments/${item.id}`;
  return (
    <div className="relative flex h-16 items-center gap-3 border-b border-pace-line pl-2 pr-1">
      <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-pace-green">
        <Image src="/class/assignment.svg" alt="" width={20} height={20} />
      </span>
      <Link href={href} className="min-w-0 flex-1 truncate text-[14px] font-bold text-pace-ink after:absolute after:inset-0 after:content-['']">
        {item.title}
      </Link>
      <span className="shrink-0 whitespace-nowrap text-[12px] text-pace-muted">
        <span className="md:hidden">{statusLabel(item, false)}</span>
        <span className="hidden md:inline">{statusLabel(item, true)}</span>
      </span>
      <div className="relative z-10">
        <RowMenu href={href} />
      </div>
    </div>
  );
}
