"use server";

import { requireGradingInstructor } from "@/lib/submission-access";
import { loadItemInsight } from "@/lib/insights/load-insight";
import { generateNextSteps, MissingKeyError, type NextSteps } from "@/lib/insights/next-steps";
import { formatClock } from "@/lib/insights/format";
import type { RiskFlag } from "@/lib/risk-score";
import type { LogEntry } from "@/lib/insights/activity";

export type InsightsResult =
  | {
      success: true;
      flag: RiskFlag;
      itemNumber: number;
      log: (LogEntry & { time: string })[];
      pastePercent: number;
      typed: number;
      similarName: string | null;
      similarStudentId: string | null;
      steps: NextSteps | null;
      stepsError: string | null;
    }
  | { success: false; error: string };

export async function getInsights(postId: string, studentId: string, itemId: string): Promise<InsightsResult> {
  try {
    await requireGradingInstructor(postId);
    const insight = await loadItemInsight(postId, studentId, itemId);
    if (!insight) return { success: false, error: "Submission not found" };
    let steps: NextSteps | null = null;
    let stepsError: string | null = null;
    try {
      steps = await generateNextSteps(insight.facts);
    } catch (error) {
      stepsError =
        error instanceof MissingKeyError ? error.message : "The AI could not write next steps right now.";
    }
    return {
      success: true,
      flag: insight.flag,
      itemNumber: insight.itemNumber,
      log: insight.activity.log.map((entry) => ({ ...entry, time: formatClock(entry.at) })),
      pastePercent: insight.activity.pastePercent,
      typed: insight.activity.typed,
      similarName: insight.similarName,
      similarStudentId: insight.similarStudentId,
      steps,
      stepsError,
    };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "Could not load insights" };
  }
}
