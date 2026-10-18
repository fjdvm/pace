export interface LeaderboardEntry {
  studentId: string;
  email: string;
  name: string | null;
  totalXp: number;
  level: number;
  rank: number;
}
