import { PodiumCard } from "./podium-card";
import { LeaderboardTable } from "./leaderboard-table";
import { XpGuideCard } from "./xp-guide-card";
import type { LeaderboardEntry } from "./leaderboard-types";

type LeaderboardPanelProps = {
  leaderboard: LeaderboardEntry[];
  currentUserId: string;
};

export function LeaderboardPanel({ leaderboard, currentUserId }: LeaderboardPanelProps) {
  const podium = [2, 1, 3]
    .map((rank) => leaderboard.find((e) => e.rank === rank))
    .filter((e): e is LeaderboardEntry => Boolean(e));
  const rest = leaderboard.filter((e) => e.rank > 3);
  const empty = leaderboard.length === 0 || leaderboard.every((e) => e.totalXp === 0);

  return (
    <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
      <div className="flex min-w-0 flex-1 flex-col gap-4">
        {empty ? (
          <p className="rounded-[20px] border-[1.5px] border-pace-line bg-white p-10 text-center text-[13px] text-pace-ink-2">
            No leaderboard yet. Once students earn XP, rankings will appear here.
          </p>
        ) : (
          <>
            <div className="flex items-end gap-4">
              {podium.map((entry) => (
                <PodiumCard key={entry.studentId} entry={entry} isYou={entry.studentId === currentUserId} />
              ))}
            </div>
            {rest.length > 0 && <LeaderboardTable entries={rest} currentUserId={currentUserId} />}
          </>
        )}
      </div>
      <XpGuideCard />
    </div>
  );
}
