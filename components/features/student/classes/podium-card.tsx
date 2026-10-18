import { cn } from "@/lib/utils";
import { PaceTag } from "@/components/features/student/shared/pace-tag";
import { PaceIcon } from "@/components/features/student/shared/pace-icon";
import { InitialsAvatar } from "@/components/features/student/shared/initials-avatar";
import { getDisplayName } from "@/lib/display-name";
import type { LeaderboardEntry } from "./leaderboard-types";

type PodiumCardProps = {
  entry: LeaderboardEntry;
  isYou: boolean;
};

const heights: Record<number, string> = { 1: "h-[220px]", 2: "h-[190px]", 3: "h-[176px]" };

export function PodiumCard({ entry, isYou }: PodiumCardProps) {
  const first = entry.rank === 1;
  const name = getDisplayName(entry);

  return (
    <div
      className={cn(
        "flex min-w-0 flex-1 flex-col items-center justify-center gap-2 rounded-[20px] px-2 shadow-[0_4px_0_0_var(--color-pace-line)]",
        heights[entry.rank],
        first
          ? "border-2 border-pace-amber bg-pace-amber-tint"
          : isYou
            ? "border-2 border-pace-green bg-white"
            : "border-[1.5px] border-pace-line bg-white",
      )}
    >
      <div className="flex items-center gap-1.5 text-base font-bold leading-snug text-pace-ink">
        {first && <PaceIcon name="trophy-amber" size={16} />}#{entry.rank}
      </div>
      <InitialsAvatar
        name={name}
        className={cn("size-11 text-pace-ink", first ? "bg-pace-amber" : "bg-pace-sunken")}
      />
      <p className="max-w-full truncate text-[13px] font-semibold text-pace-ink">
        {name}
        {isYou ? " (you)" : ""}
      </p>
      <PaceTag tone={first ? "amber" : "neutral"}>{entry.totalXp.toLocaleString()} XP</PaceTag>
    </div>
  );
}
