import Link from "next/link";
import { HeartsRow } from "@/components/features/student/shared/hearts-row";
import { paceButtonBase, paceButtonStyles } from "@/components/features/student/shared/pace-button";
import { cn } from "@/lib/utils";

type YourWorkSheetProps = {
  monitoringEnabled?: boolean;
  aiTutorEnabled?: boolean;
  heartsLeft: number;
  heartsMax: number;
  workHref: string;
};

export function YourWorkSheet({ heartsLeft, heartsMax, workHref, monitoringEnabled, aiTutorEnabled }: YourWorkSheetProps) {
  return (
    <section className="fixed inset-x-0 bottom-0 z-20 flex flex-col gap-3 rounded-t-2xl bg-white px-4 pb-7 pt-4 shadow-[0_-4px_16px_rgba(0,0,0,0.12)] md:hidden">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-bold leading-[1.35] tracking-[-0.08px] text-pace-ink">Your work</h2>
        {aiTutorEnabled !== false && <HeartsRow left={heartsLeft} max={heartsMax} />}
      </div>
      <Link href={workHref} className={cn(paceButtonBase, paceButtonStyles.green, "h-[52px] w-full text-[15px]")}>
        Open in editor
      </Link>
      {monitoringEnabled !== false && <p className="text-[13px] text-pace-muted">Typing, pasting, and tab switches are recorded while you work.</p>}
    </section>
  );
}
