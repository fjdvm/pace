export type ConstructId = "PU" | "PEOU" | "ATU" | "BI";
export type ThemeTone = "green" | "red" | "amber" | "blue" | "neutral";

export const CONSTRUCTS: { id: ConstructId; name: string; items: string[] }[] = [
  {
    id: "PU",
    name: "Perceived usefulness",
    items: [
      "PACE helps me understand programming concepts faster.",
      "The hint levels help me fix my own mistakes.",
      "PACE improves the quality of my code.",
      "I find PACE useful for my programming course.",
    ],
  },
  {
    id: "PEOU",
    name: "Perceived ease of use",
    items: [
      "Learning to use PACE was easy for me.",
      "The workspace is clear and easy to navigate.",
      "Asking the tutor for help is simple.",
      "It is easy to see my hearts and when they refill.",
    ],
  },
  {
    id: "ATU",
    name: "Attitude toward use",
    items: [
      "Using PACE for coding practice is a good idea.",
      "I enjoy working on assignments in PACE.",
      "I like that the tutor guides me instead of giving answers.",
      "Using PACE makes programming practice more pleasant.",
    ],
  },
  {
    id: "BI",
    name: "Intention to use",
    items: [
      "I intend to keep using PACE in my programming course.",
      "I would use PACE again for future assignments.",
      "I would recommend PACE to my classmates.",
      "I plan to use PACE regularly.",
    ],
  },
];

export const THEMES: { id: string; label: string; tone: ThemeTone }[] = [
  { id: "hints-helped", label: "Hints helped me find the bug myself", tone: "green" },
  { id: "more-hearts", label: "Wants more hearts or a faster refill", tone: "red" },
  { id: "vague-hints", label: "Level 1 hints felt too vague", tone: "amber" },
  { id: "faster-runs", label: "Faster code runs", tone: "blue" },
  { id: "other", label: "Other", tone: "neutral" },
];

export const SCALE_CUTOFF = 0.7;
export const POPULATION = 652;
export const MARGIN_OF_ERROR = 0.05;
export const ELIGIBLE_INSTRUCTORS = 11;
export const PILOT_SIZE = 30;
