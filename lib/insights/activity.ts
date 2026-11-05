import type { BehavioralEvent } from "@/lib/types/behavioral-signals";
import { formatAway } from "./format";

export type LogTone = "muted" | "amber" | "red" | "purple" | "green";
export type LogKind = "open" | "typing" | "away" | "paste" | "tutor" | "run" | "submit";

export interface LogEntry {
  at: number;
  kind: LogKind;
  tone: LogTone;
  text: string;
}

export interface ItemActivity {
  typed: number;
  pasted: number;
  pastePercent: number;
  tabLeaves: number;
  awaySecs: number;
  log: LogEntry[];
}

export interface ActivityInput {
  events: BehavioralEvent[];
  legacyKeystrokes: number;
  tutorQuestions: number[];
  itemId: string;
  firstItemId: string;
  fileName: string;
  finalCodeLength: number;
}

type Scoped = BehavioralEvent & { itemId?: string };

export function eventsForItem(events: BehavioralEvent[], itemId: string, firstItemId: string) {
  return events.filter((e) => {
    if (e.type === "focus" || e.type === "blur") return false;
    if (e.type === "submit") return true;
    return ((e as Scoped).itemId ?? firstItemId) === itemId;
  });
}

function entryFor(e: BehavioralEvent, fileName: string): LogEntry | null {
  switch (e.type) {
    case "open":
      return { at: e.timestamp, kind: "open", tone: "muted", text: "Opened the assignment" };
    case "typing":
      return { at: e.timestamp, kind: "typing", tone: "muted", text: `Typed ${e.chars} characters` };
    case "tab_switch":
      return {
        at: e.timestamp - e.awayDurationSecs * 1000,
        kind: "away",
        tone: "amber",
        text: `Left the assignment tab for ${formatAway(e.awayDurationSecs)}`,
      };
    case "paste": {
      const lines = e.lines ? ` (${e.lines} ${e.lines === 1 ? "line" : "lines"})` : "";
      return { at: e.timestamp, kind: "paste", tone: "red", text: `Pasted ${e.length} characters${lines} into ${fileName}` };
    }
    case "run_attempt":
      return { at: e.timestamp, kind: "run", tone: "green", text: `Ran tests · ${e.passedCount} of ${e.totalCount} passed` };
    case "submit":
      return { at: e.timestamp, kind: "submit", tone: "green", text: "Turned in" };
    default:
      return null;
  }
}

export function buildItemActivity(input: ActivityInput): ItemActivity {
  const events = eventsForItem(input.events, input.itemId, input.firstItemId);
  const hasTyping = input.events.some((e) => e.type === "typing");
  const typed = hasTyping
    ? events.reduce((sum, e) => sum + (e.type === "typing" ? e.chars : 0), 0)
    : input.itemId === input.firstItemId ? input.legacyKeystrokes : 0;
  const pastes = events.filter((e) => e.type === "paste");
  const pasted = pastes.reduce((sum, e) => sum + (e.type === "paste" ? e.length : 0), 0);
  const aways = events.filter((e) => e.type === "tab_switch");
  const awaySecs = aways.reduce((sum, e) => sum + (e.type === "tab_switch" ? e.awayDurationSecs : 0), 0);
  const log = events.flatMap((e) => entryFor(e, input.fileName) ?? []);
  if (input.tutorQuestions.length > 0) {
    const n = input.tutorQuestions.length;
    log.push({
      at: Math.min(...input.tutorQuestions),
      kind: "tutor",
      tone: "purple",
      text: `Asked the AI tutor ${n} ${n === 1 ? "question" : "questions"}`,
    });
  }
  log.sort((a, b) => a.at - b.at);
  const basis = Math.max(input.finalCodeLength, 1);
  return {
    typed,
    pasted,
    pastePercent: Math.min(100, Math.round((pasted / basis) * 100)),
    tabLeaves: aways.length,
    awaySecs,
    log,
  };
}
