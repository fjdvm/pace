import { computeRiskScore, type RiskFlag, type RiskScoreResult } from "@/lib/risk-score";
import type { BehavioralEvent } from "@/lib/types/behavioral-signals";
import { eventsForItem } from "./activity";

export function itemRisk(
  events: BehavioralEvent[],
  itemId: string,
  firstItemId: string,
  finalCodeLength: number,
  typed: number,
): RiskScoreResult {
  return computeRiskScore(eventsForItem(events, itemId, firstItemId), {
    finalCodeLength,
    keystrokeCount: typed,
  });
}

export function flagLabel(flag: RiskFlag) {
  return flag === "Medium" ? "Med" : flag;
}

export function flagTone(flag: RiskFlag) {
  return flag === "High" ? "red" : flag === "Medium" ? "amber" : "neutral";
}
