export const HINT_LEVEL_NAMES = [
  "Gentle nudge",
  "Concept hint",
  "Specific steps",
  "Guided walkthrough",
  "Near-pseudocode",
];

export const MAX_HINT_LEVEL = HINT_LEVEL_NAMES.length;

export function nextHintLevel(heartsSpent: number) {
  return Math.min(MAX_HINT_LEVEL, Math.max(1, heartsSpent + 1));
}

export function hintLevelName(level: number) {
  return HINT_LEVEL_NAMES[Math.min(MAX_HINT_LEVEL, Math.max(1, level)) - 1];
}
