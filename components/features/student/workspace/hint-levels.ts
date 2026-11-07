export const HINT_LEVEL_NAMES = [
  "Concept",
  "Where to look",
  "Specific steps",
  "Guided walkthrough",
  "Near-pseudocode",
];

export const MAX_HINT_LEVEL = HINT_LEVEL_NAMES.length;

export function nextHintLevel(heartsSpent: number, tieredHintsEnabled = true) {
  if (!tieredHintsEnabled) return 1;
  return Math.min(MAX_HINT_LEVEL, Math.max(1, heartsSpent + 1));
}

export function hintLevelName(level: number) {
  return HINT_LEVEL_NAMES[Math.min(MAX_HINT_LEVEL, Math.max(1, level)) - 1];
}

export function hintLevelForMessage(messages: { role: string; hintLevel?: number }[], index: number, tieredHintsEnabled = true) {
  if (!tieredHintsEnabled) return 1;
  if (messages[index]?.hintLevel !== undefined) return Math.min(MAX_HINT_LEVEL, Math.max(1, messages[index].hintLevel));
  return Math.min(MAX_HINT_LEVEL, Math.max(1,
    messages.slice(0, index + 1).filter((message) => message.role === "user").length));
}
