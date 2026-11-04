import { formatDueShort } from "@/lib/student-dates";
import { formatDueTime } from "@/lib/next-upcoming";

function dueLabel(dueDate: string) {
  const short = formatDueShort(dueDate);
  return `Due ${/^(Today|Tomorrow)$/.test(short) ? short.toLowerCase() : short}`;
}

type UpcomingCardProps = {
  title: string;
  dueDate: string;
  onViewAll: () => void;
};

export function UpcomingCard({ title, dueDate, onViewAll }: UpcomingCardProps) {
  return (
    <>
      <aside className="hidden w-[210px] shrink-0 flex-col gap-2 self-start rounded-lg border border-pace-line bg-white p-4 md:flex">
        <p className="text-base font-bold leading-[1.35] tracking-[-0.005em] text-pace-ink">Upcoming</p>
        <p className="text-[13px] leading-normal text-pace-muted">{dueLabel(dueDate)}</p>
        <p className="text-[13px] leading-normal text-pace-ink">
          {formatDueTime(dueDate)} – {title}
        </p>
        <button type="button" onClick={onViewAll} className="cursor-pointer self-start text-[13px] font-bold leading-normal text-pace-green-deep">
          View all
        </button>
      </aside>
      <div className="flex flex-col gap-1 rounded-lg bg-pace-green-tint px-4 py-3 text-[13px] leading-normal md:hidden">
        <p className="font-bold text-pace-green-deep">{dueLabel(dueDate)}</p>
        <p className="text-pace-ink">
          {formatDueTime(dueDate)} – {title}
        </p>
      </div>
    </>
  );
}
