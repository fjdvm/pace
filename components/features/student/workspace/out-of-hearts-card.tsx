import { PaceIcon } from "@/components/features/student/shared/pace-icon";

const tips = [
  ["workspace/book", "Re-read the instructions and examples"],
  ["workspace/play", "Run your tests and compare the output"],
  ["workspace/sparkles-14-b", "Revisit the tutor’s last hint above"],
];

export function OutOfHeartsCard({ timeToRegen }: { timeToRegen: string }) {
  return (
    <div className="flex flex-col gap-3 rounded-2xl bg-pace-red-tint p-[18px]">
      <div className="flex items-center gap-2">
        <PaceIcon name="workspace/clock-red" size={18} />
        <span className="text-base font-bold leading-snug tracking-[-0.005em] text-pace-ink">
          Out of hearts for now
        </span>
      </div>
      <p className="text-[13px] leading-normal text-pace-ink-2">
        {timeToRegen ? `Your next heart arrives in ${timeToRegen}. ` : ""}A short break often helps more than another
        hint. Meanwhile:
      </p>
      {tips.map(([icon, text]) => (
        <div key={text} className="flex items-center gap-2 text-[13px] leading-normal text-pace-ink">
          <PaceIcon name={icon} size={14} />
          {text}
        </div>
      ))}
    </div>
  );
}
