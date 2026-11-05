import type { RiskFlag } from "@/lib/risk-score";
import type { StoredBehavioralSignals } from "@/lib/types/behavioral-signals";
import { buildItemActivity } from "./activity";
import { itemRisk } from "./item-risk";

const order: RiskFlag[] = ["Low", "Medium", "High"];

export function studentFlag(
  signals: StoredBehavioralSignals | null | undefined,
  answers: { itemId: string; code: string }[],
  itemIds: string[],
): RiskFlag {
  const events = signals?.events;
  if (!events || itemIds.length === 0) return signals?.riskScore?.flag ?? "Low";
  const firstItemId = itemIds[0];
  return itemIds.reduce<RiskFlag>((worst, itemId) => {
    const length = answers.find((a) => a.itemId === itemId)?.code.length ?? 0;
    const typed = buildItemActivity({
      events, legacyKeystrokes: signals.keystrokeCount ?? 0, tutorQuestions: [], itemId, firstItemId, fileName: "", finalCodeLength: length,
    }).typed;
    const flag = itemRisk(events, itemId, firstItemId, length, typed).flag;
    return order.indexOf(flag) > order.indexOf(worst) ? flag : worst;
  }, "Low");
}
