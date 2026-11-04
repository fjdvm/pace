import Link from "next/link";

const tab = "flex w-[100px] flex-col items-center justify-end gap-3 px-4 pt-[14px] text-[15px] leading-[1.55]";

export function WorkTabs({ assignmentId }: { assignmentId: string }) {
  return (
    <nav className="hidden justify-center gap-2 border-b border-pace-line bg-white md:flex">
      <Link href={`/dashboard/assignments/${assignmentId}/edit`} className={`${tab} text-pace-ink-2`}>
        Instructions
        <span className="h-1 w-full" />
      </Link>
      <span aria-current="page" className={`${tab} font-bold text-pace-green-deep`}>
        Student work
        <span className="h-1 w-full rounded-t-[3px] bg-pace-green" />
      </span>
    </nav>
  );
}
