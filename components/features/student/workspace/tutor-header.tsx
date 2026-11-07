import { nextHintLevel } from "./hint-levels";
type Props = {
  tieredHintsEnabled?: boolean;
  hearts: number;
  maxHearts: number;
  heartsSpent: number;
  timeToRegen: string;
};
export function TutorHeader({ heartsSpent, tieredHintsEnabled }: Props) {
  return (
    <div className="hidden shrink-0 items-center lg:flex gap-2.5 border-b border-pace-line px-4 py-3.5">
      <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-pace-purple text-[11px] font-bold text-white">
        ✦
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-base font-bold leading-[1.35]">AI tutor</p>
        <p className="text-[13px] leading-normal text-pace-muted">
          Hints, not answers
        </p>
      </div>
      <span className="rounded-full bg-pace-purple-tint px-2.5 py-1 text-xs font-bold text-pace-purple">
        Hint level {nextHintLevel(heartsSpent, tieredHintsEnabled)} next
      </span>
    </div>
  );
}
