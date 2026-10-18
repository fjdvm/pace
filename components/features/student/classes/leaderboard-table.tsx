import { InitialsAvatar } from "@/components/features/student/shared/initials-avatar";
import { cn } from "@/lib/utils";
import { getDisplayName } from "@/lib/display-name";
import type { LeaderboardEntry } from "./leaderboard-types";

type LeaderboardTableProps = {
  entries: LeaderboardEntry[];
  currentUserId: string;
};

export function LeaderboardTable({ entries, currentUserId }: LeaderboardTableProps) {
  return (
    <div className="flex flex-col rounded-[20px] border-[1.5px] border-pace-line bg-white py-2">
      <div className="flex gap-4 px-5 py-2.5 text-[11px] font-bold uppercase leading-snug tracking-[0.06em] text-pace-muted">
        <span className="w-[60px] shrink-0">Rank</span>
        <span className="min-w-0 flex-1">Student</span>
        <span className="w-20 shrink-0">Level</span>
        <span className="w-[90px] shrink-0">XP</span>
      </div>
      {entries.map((entry) => {
        const name = getDisplayName(entry);
        return (
          <div
            key={entry.studentId}
            className={cn(
              "flex items-center gap-4 border-t border-pace-line px-5 py-2.5 text-[13px]",
              entry.studentId === currentUserId && "bg-pace-green-tint/50",
            )}
          >
            <span className="w-[60px] shrink-0 text-pace-ink-2">#{entry.rank}</span>
            <span className="flex min-w-0 flex-1 items-center gap-2.5">
              <InitialsAvatar name={name} className="size-[30px] bg-pace-sunken text-pace-ink" />
              <span className="truncate font-semibold text-pace-ink">
                {name}
                {entry.studentId === currentUserId ? " (you)" : ""}
              </span>
            </span>
            <span className="w-20 shrink-0 text-pace-ink-2">Lvl {entry.level}</span>
            <span className="w-[90px] shrink-0 font-semibold text-pace-ink">{entry.totalXp.toLocaleString()}</span>
          </div>
        );
      })}
    </div>
  );
}
