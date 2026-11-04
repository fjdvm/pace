import { NoEnrolledCard } from "./no-enrolled-card";
import { Podium } from "@/components/features/gamification/components/podium";
import { getDisplayName } from "@/lib/display-name";

interface LeaderboardEntry {
  studentId: string;
  email: string;
  name: string | null;
  totalXp: number;
  level: number;
  rank: number;
}

interface ClassLeaderboardTabProps {
  leaderboard: LeaderboardEntry[];
  myRank?: number;
}

export function ClassLeaderboardTab({ leaderboard, myRank }: ClassLeaderboardTabProps) {
  const firstPlace = leaderboard.find((e) => e.rank === 1);
  const secondPlace = leaderboard.find((e) => e.rank === 2);
  const thirdPlace = leaderboard.find((e) => e.rank === 3);
  const tableEntries = leaderboard.filter((e) => e.rank > 3);

  if (leaderboard.length === 0 || leaderboard.every((e) => e.totalXp === 0)) {
    return <NoEnrolledCard />;
  }

  return (
    <div className="max-w-5xl w-full space-y-6">
      {myRank ? (
        <p className="text-xs text-secondary">
          Your rank in this class: <span className="font-bold text-on-surface">#{myRank}</span>
        </p>
      ) : null}

      <Podium firstPlace={firstPlace} secondPlace={secondPlace} thirdPlace={thirdPlace} />

      <div className="bg-white rounded-[24px] p-6 shadow-sm border border-surface-container">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="text-secondary text-xs border-b border-surface-container font-semibold">
              <th className="pb-4 pl-4 w-16">Rank</th>
              <th className="pb-4">Scholar</th>
              <th className="pb-4 text-right">XP</th>
              <th className="pb-4 text-right">Level</th>
            </tr>
          </thead>
          <tbody>
            {tableEntries.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-8 text-center text-xs text-secondary italic">
                  No other entries in leaderboard.
                </td>
              </tr>
            ) : (
              tableEntries.map((entry) => (
                <tr key={entry.studentId} className="border-b border-surface-container last:border-0 hover:bg-surface-container-low transition-colors">
                  <td className="py-4 pl-4 text-sm font-bold text-on-surface">#{entry.rank}</td>
                  <td className="py-4 text-sm text-on-surface">
                    <span className="font-semibold block">{getDisplayName(entry)}</span>
                    <span className="text-[10px] text-secondary block">{entry.email}</span>
                  </td>
                  <td className="py-4 text-sm text-right font-bold text-on-surface">{entry.totalXp}</td>
                  <td className="py-4 text-sm text-right text-secondary">{entry.level}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
