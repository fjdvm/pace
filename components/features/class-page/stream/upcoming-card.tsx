import { formatDueShort } from "@/lib/student-dates";
import { formatDueTime } from "@/lib/next-upcoming";

function dueLabel(dueDate: string) {
  const short = formatDueShort(dueDate);
  return `Due ${/^(Today|Tomorrow)$/.test(short) ? short.toLowerCase() : short}`;
}

type UpcomingCardProps = {
  next: { title: string; dueDate: string } | null;
  onViewAll: () => void;
};

export function UpcomingCard({ next, onViewAll }: UpcomingCardProps) {
  const heading = next ? dueLabel(next.dueDate) : "Nothing due soon";
  const detail = next ? `${formatDueTime(next.dueDate)} – ${next.title}` : null;
  return (
    <>
      <aside className="hidden w-[210px] shrink-0 flex-col gap-2 self-start rounded-lg border border-pace-line bg-white p-4 md:flex">
        <p className="text-base font-bold leading-[1.35] tracking-[-0.005em] text-pace-ink">Upcoming</p>
        <p className="text-[13px] leading-normal text-pace-muted">{heading}</p>
        {detail && <p className="text-[13px] leading-normal text-pace-ink">{detail}</p>}
        <button type="button" onClick={onViewAll} className="cursor-pointer self-start text-[13px] font-bold leading-normal text-pace-green-deep">
          View all
        </button>
      </aside>
      <div className="flex flex-col gap-1 rounded-lg bg-pace-green-tint px-4 py-3 text-[13px] leading-normal md:hidden">
        <p className="font-bold text-pace-green-deep">{heading}</p>
        {detail && <p className="text-pace-ink">{detail}</p>}
      </div>
    </>
  );
}
