import { LogDot } from "./log-dot";
import type { InsightsResult } from "@/app/actions/insights/get-insights";

type Ok = Extract<InsightsResult, { success: true }>;

function shortText(entry: Ok["log"][number], itemNumber: number, typed: number, pastePercent: number) {
  if (entry.kind === "open") return `Opened Item ${itemNumber}${typed > 0 ? ` and typed ${typed} characters` : ""}`;
  if (entry.kind === "away") return entry.text.replace("the assignment tab", "the tab").replace(/ \d+ s$/, "");
  if (entry.kind === "paste") return `${entry.text.replace(/ \(\d+ lines?\) into .*$/, "").replace(/ into .*$/, "")} (${pastePercent}% of the final code)`;
  if (entry.kind === "tutor") return entry.text.replace("AI tutor", "tutor");
  return entry.text;
}

export function InsightsLog({ result }: { result: Ok }) {
  const entries = result.log.filter((e) => e.kind !== "typing" && e.kind !== "run");
  return (
    <div className="hidden flex-col gap-2 rounded-[10px] border border-pace-line p-3.5 md:flex">
      {entries.map((entry, i) => (
        <div key={i} className="flex items-center gap-2.5 text-[13px]">
          <time className="font-mono text-pace-muted">{entry.time}</time>
          <LogDot tone={entry.kind === "submit" ? "muted" : entry.tone} className="size-2" />
          <span>{shortText(entry, result.itemNumber, result.typed, result.pastePercent)}</span>
        </div>
      ))}
    </div>
  );
}
