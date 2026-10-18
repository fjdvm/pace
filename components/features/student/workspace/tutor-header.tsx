import { PaceIcon } from "@/components/features/student/shared/pace-icon";
import { HeartsRow } from "@/components/features/student/shared/hearts-row";
import { cn } from "@/lib/utils";
import { MAX_HINT_LEVEL, hintLevelName, nextHintLevel } from "./hint-levels";

type TutorHeaderProps = {
  hearts: number;
  maxHearts: number;
  heartsSpent: number;
  timeToRegen: string;
};

export function TutorHeader({ hearts, maxHearts, heartsSpent, timeToRegen }: TutorHeaderProps) {
  const level = nextHintLevel(heartsSpent);

  return (
    <div className="flex shrink-0 flex-col gap-3.5 border-b border-pace-line px-5 pb-4 pt-[18px]">
      <div className="flex items-center gap-2.5">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-pace-purple">
          <PaceIcon name="workspace/sparkles-white" size={18} />
        </span>
        <div className="flex min-w-0 flex-1 flex-col">
          <span className="text-base font-bold leading-snug tracking-[-0.005em] text-pace-ink">PACE Tutor</span>
          <span className="text-[13px] leading-normal text-pace-muted">Hints only. Never the full solution.</span>
        </div>
        <PaceIcon name="workspace/info" size={18} />
      </div>
      <div className="flex flex-col gap-2.5 rounded-[14px] bg-pace-canvas px-3.5 py-3">
        <div className="flex items-center gap-2.5 text-[13px] leading-normal">
          <HeartsRow left={hearts} max={maxHearts} />
          <span className="font-semibold text-pace-ink">
            {hearts} of {maxHearts} hearts
          </span>
          <span className="flex-1" />
          {timeToRegen && (
            <span className="flex items-center gap-1 text-pace-muted">
              <PaceIcon name="workspace/clock-13" size={13} />+1 in {timeToRegen}
            </span>
          )}
        </div>
        <div className="flex flex-col gap-1.5">
          <div className="flex text-[13px] leading-normal">
            <span className="text-pace-muted">Next hint</span>
            <span className="flex-1" />
            <span className="font-bold text-pace-purple">
              Level {level} · {hintLevelName(level)}
            </span>
          </div>
          <div className="flex gap-1">
            {Array.from({ length: MAX_HINT_LEVEL }, (_, i) => (
              <span
                key={i}
                className={cn(
                  "h-1.5 flex-1 rounded-full",
                  i < level - 1 && "bg-pace-purple",
                  i === level - 1 && "bg-pace-purple-tint",
                  i >= level && "bg-pace-sunken",
                )}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
