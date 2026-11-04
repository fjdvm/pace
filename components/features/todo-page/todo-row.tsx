import Link from "next/link";
import { FileText } from "lucide-react";
import { splitClassName } from "@/lib/class-name";
import type { StudentAssignment } from "@/components/features/student/types";
import { dueLabel } from "./due-label";

export function TodoRow({ assignment }: { assignment: StudentAssignment }) {
  const { code } = splitClassName(assignment.className);
  return (
    <li>
      <Link
        href={`/dashboard/assignments/${assignment.id}`}
        className="flex h-16 items-center gap-4 border-b border-pace-line bg-white pl-4 pr-4 hover:bg-pace-sunken"
      >
        <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-pace-green text-white">
          <FileText className="size-6" strokeWidth={1.5} />
        </span>
        <span className="min-w-0 flex-1 truncate text-[15px] font-bold leading-[1.55] text-pace-ink">
          {assignment.title} · {code}
        </span>
        <span className="shrink-0 text-[13px] leading-normal text-pace-muted">{dueLabel(assignment)}</span>
      </Link>
    </li>
  );
}
