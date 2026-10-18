export type ConstructId = "PU" | "PEOU" | "ATU" | "BI";

export const ITEMS_PER_CONSTRUCT = 5;

export const CONSTRUCTS: { id: ConstructId; name: string; items: string[] }[] = [
  {
    id: "PU",
    name: "Perceived usefulness",
    items: [
      "Using PACE lets me write, run, and submit programming assignments without switching between separate tools.",
      "The AI tutor\u2019s hints help me find where my code goes wrong.",
      "The AI tutor\u2019s explanations help me understand the concepts used in the assignment.",
      "The hearts limit makes me try to solve the problem on my own before asking the AI tutor.",
      "Overall, PACE is useful for completing programming assignments.",
    ],
  },
  {
    id: "PEOU",
    name: "Perceived ease of use",
    items: [
      "Learning to use PACE is easy for me.",
      "Writing and running code in the PACE editor is easy.",
      "It is easy to ask the AI tutor a question and understand its answer.",
      "The hearts counter and regeneration timer are easy to understand.",
      "Overall, PACE is easy to use.",
    ],
  },
  {
    id: "ATU",
    name: "Attitude toward use",
    items: [
      "Using PACE for programming assignments is a good idea.",
      "I like using PACE.",
      "I am comfortable with an AI tutor that gives hints instead of complete solutions.",
      "Using PACE is a pleasant experience.",
      "I would rather use PACE than switch between an LMS, an IDE, and a separate AI tool.",
    ],
  },
  {
    id: "BI",
    name: "Intention to use",
    items: [
      "I intend to use PACE for future programming assignments if it is available.",
      "When I get stuck, I would ask PACE\u2019s AI tutor before turning to a general-purpose AI tool.",
      "I would recommend PACE to other students.",
      "I plan to keep using PACE throughout a programming course.",
      "I would use PACE for practice even when my instructor does not require it.",
    ],
  },
];

export const LIKERT_LABELS = ["Strongly disagree", "Disagree", "Neutral", "Agree", "Strongly agree"];

export type QuestionnaireVersion = "student" | "instructor";

export const YEAR_LEVELS = ["1st year", "2nd year", "3rd year", "4th year"];
export const COURSE_COUNTS = ["1", "2", "3", "4", "5 or more"];
export const AI_USAGE_OPTIONS = [
  { id: "never", label: "Never" },
  { id: "sometimes", label: "Sometimes" },
  { id: "often", label: "Often" },
];

export const COMMENT_PROMPTS = [
  { id: "helpful", short: "Most helpful", label: "What did you find most helpful about PACE?" },
  { id: "problems", short: "Problems", label: "What problems did you encounter while using PACE?" },
  { id: "improve", short: "Improvements", label: "What would you change or add to improve PACE?" },
] as const;

export type CommentPromptId = (typeof COMMENT_PROMPTS)[number]["id"];

export const SCALE_CUTOFF = 0.7;
export const POPULATION = 652;
export const MARGIN_OF_ERROR = 0.05;
export const PILOT_SIZE = 30;
