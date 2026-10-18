import { computeLevel } from "@/lib/levels";

export interface SubmitReward {
  events: { eventType: string; xpAmount: number }[];
  totalXp: number;
  heartsUsed: number;
}

const EVENT_LABELS: Record<string, (passed: number) => string> = {
  pass_case: (passed) => `${passed} ${passed === 1 ? "test" : "tests"} passed`,
  perfect_score: () => "Perfect score",
  no_hints: () => "Solved without using the tutor",
  fewer_hints: () => "Solved with 1–2 hearts",
  streak_maintained: () => "Keeping your weekly streak",
};

export function describeReward(reward: SubmitReward, passedTests: number) {
  const earned = reward.events.reduce((sum, e) => sum + e.xpAmount, 0);
  const before = computeLevel(reward.totalXp - earned).level;
  const after = computeLevel(reward.totalXp);
  return {
    earned,
    rows: reward.events.map((e) => ({
      label: (EVENT_LABELS[e.eventType] ?? (() => e.eventType))(passedTests),
      xp: e.xpAmount,
    })),
    level: after.level,
    leveledUp: after.level > before,
    levelProgress: (after.currentXp / Math.max(after.nextThreshold, 1)) * 100,
  };
}
