import { cn } from "@/lib/utils";
import { PaceIcon } from "@/components/features/student/shared/pace-icon";
import { ProgressBar } from "@/components/features/student/shared/progress-bar";

type WeekCardProps = {
  activeDays: number[];
  xp: { level: number; currentXp: number; nextThreshold: number };
};

const DAYS = ["M", "T", "W", "T", "F", "S", "S"];

export function WeekCard({ activeDays, xp }: WeekCardProps) {
  const today = (new Date().getDay() + 6) % 7;
  const remaining = Math.max(xp.nextThreshold - xp.currentXp, 0);

  return (
    <section className="flex flex-col gap-3.5 rounded-[20px] border-[1.5px] border-pace-line bg-white p-[22px]">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-bold leading-snug tracking-[-0.005em] text-pace-ink">This week</h2>
        <span className="flex items-center gap-1 text-[13px] font-semibold text-pace-ink">
          <PaceIcon name="flame-16" size={16} />
          {activeDays.length} {activeDays.length === 1 ? "day" : "days"}
        </span>
      </div>
      <div className="flex gap-1.5">
        {DAYS.map((label, i) => {
          const done = activeDays.includes(i);
          return (
            <div key={i} className="flex flex-1 flex-col items-center gap-1.5">
              <span
                className={cn(
                  "flex size-8 items-center justify-center rounded-full",
                  done && "bg-pace-amber",
                  !done && i === today && "border-2 border-pace-amber bg-white",
                  !done && i !== today && "bg-pace-sunken",
                )}
              >
                {done && <PaceIcon name="check-white-14" size={14} />}
              </span>
              <span className={cn("text-[13px]", i === today ? "text-pace-ink" : "text-pace-muted")}>{label}</span>
            </div>
          );
        })}
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between text-[13px] leading-normal">
          <span className="font-semibold text-pace-ink">Level {xp.level}</span>
          <span className="text-pace-muted">{remaining} XP to Level {xp.level + 1}</span>
        </div>
        <ProgressBar tone="amber" value={(xp.currentXp / Math.max(xp.nextThreshold, 1)) * 100} />
      </div>
    </section>
  );
}
