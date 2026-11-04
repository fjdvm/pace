import Link from "next/link";
import { splitSection } from "@/lib/class-name";
import { classColour } from "@/lib/class-colour";
import { getInitials } from "@/components/features/student/shared/initials-avatar";

type ClassCardProps = {
  id: string;
  name: string;
  instructorName: string;
  menu?: React.ReactNode;
};

export function ClassCard({ id, name, instructorName, menu }: ClassCardProps) {
  const colour = classColour(id);
  const { title, section } = splitSection(name);
  return (
    <div className="relative flex w-full sm:h-[292px] sm:w-[296px]">
    <Link
      href={`/dashboard/classes/${id}`}
      className="relative flex h-full w-full flex-col overflow-hidden rounded-lg border border-pace-line bg-white outline-none focus-visible:ring-2 focus-visible:ring-pace-purple"
    >
      <div
        style={{ backgroundColor: colour }}
        className="flex h-[120px] flex-col justify-between px-4 pb-[14px] pt-4 text-white sm:h-[100px] sm:justify-end sm:gap-0"
      >
        <p className="truncate text-xl font-bold leading-tight tracking-[-0.01em]">{title}</p>
        {section && <p className="truncate text-[13px] font-bold leading-normal">{section}</p>}
        <p className="truncate text-[13px] leading-normal">Prof. {instructorName.replace(/^prof\.?\s+/i, "")}</p>
      </div>
      <div className="hidden flex-1 border-b border-pace-line sm:block" />
      <div className="hidden h-[52px] sm:block" />
      <span
        aria-hidden
        style={{ backgroundColor: colour }}
        className="absolute left-[215px] top-[65px] hidden size-16 items-center justify-center rounded-full border-[3px] border-white text-[22px] font-bold text-white sm:flex"
      >
        {getInitials(instructorName)}
      </span>
    </Link>
    {menu}
    </div>
  );
}
