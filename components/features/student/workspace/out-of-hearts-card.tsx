import { Card } from "@/components/ui/card";
import { HeartsRow } from "@/components/features/student/shared/hearts-row";

export function OutOfHeartsCard({ timeToRegen, maxHearts }: { timeToRegen: string; maxHearts: number }) {
  return (
    <Card role="status" className="flex shrink-0 flex-col items-center gap-2 rounded-[12px] bg-pace-red-tint px-4 py-3.5 text-center ring-0">
      <HeartsRow left={0} max={maxHearts} />
      <p className="text-base font-bold leading-[1.35] tracking-[-0.08px] text-pace-red">
        You&apos;re out of hearts
      </p>
      <p className="text-[22px] font-bold leading-[1.25] tracking-[-0.22px]">
        Next heart in {timeToRegen}
      </p>
      <p className="text-[13px] leading-normal text-pace-ink-2">
        While you wait: re-read the failing test, trace line 5 by hand, and run your tests again.
      </p>
    </Card>
  );
}
