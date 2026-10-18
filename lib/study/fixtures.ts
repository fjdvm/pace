import { ITEMS_PER_CONSTRUCT, MARGIN_OF_ERROR, POPULATION, type ConstructId } from "./questionnaire";
import { slovinSampleSize } from "./stats";
import type { Respondent, StudyComment, StudyDataset, StudyRole } from "./dataset";

const STUDENT_COUNT = 186;
const INSTRUCTOR_COUNT = 9;
const BASE_DATE = Date.UTC(2026, 9, 3);

const TARGET_MEANS: Record<StudyRole, Record<ConstructId, number>> = {
  student: { PU: 4.2, PEOU: 4.18, ATU: 4.24, BI: 3.96 },
  instructor: { PU: 4.4, PEOU: 3.89, ATU: 4.11, BI: 4.02 },
};

const COMMENT_PLAN: { themeId: string; count: number; texts: string[] }[] = [
  {
    themeId: "hints-helped",
    count: 48,
    texts: [
      "The hints helped me find the bug myself.",
      "I liked that the tutor asked me questions instead of fixing my code.",
      "Level 2 hints pointed me to the exact idea I was missing.",
      "I understood my mistake because the hint made me trace the code.",
    ],
  },
  {
    themeId: "more-hearts",
    count: 37,
    texts: [
      "I ran out of hearts too early on the longer problems.",
      "Please make hearts refill faster during exams week.",
      "Five hearts is not enough when I am stuck on several tests.",
      "Waiting for a heart to come back breaks my focus.",
    ],
  },
  {
    themeId: "vague-hints",
    count: 22,
    texts: [
      "The first hint was too vague to act on.",
      "Level 1 hints felt like generic advice.",
      "I needed a more specific nudge earlier.",
    ],
  },
  {
    themeId: "faster-runs",
    count: 14,
    texts: [
      "Running my code takes a while sometimes.",
      "Faster code runs would help when I test many times.",
    ],
  },
  {
    themeId: "other",
    count: 21,
    texts: [
      "A dark mode would be nice.",
      "I would like to see my past hints in one place.",
      "The leaderboard keeps me motivated.",
      "More examples in the instructions would help.",
    ],
  },
];

function mulberry32(seed: number) {
  let state = seed;
  return () => {
    state |= 0;
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function gaussian(random: () => number) {
  const u = Math.max(random(), 1e-9);
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * random());
}

function makeRespondent(role: StudyRole, index: number, random: () => number): Respondent {
  const effect = gaussian(random) * 0.55;
  const answers = {} as Record<ConstructId, number[]>;
  for (const id of Object.keys(TARGET_MEANS[role]) as ConstructId[]) {
    answers[id] = Array.from({ length: ITEMS_PER_CONSTRUCT }, () => {
      const raw = TARGET_MEANS[role][id] + effect + gaussian(random) * 0.45;
      return Math.min(5, Math.max(1, Math.round(raw)));
    });
  }
  const dayOffset = Math.floor(random() * 28);
  const prefix = role === "student" ? "S" : "I";
  return {
    id: `${prefix}${String(index + 1).padStart(3, "0")}`,
    role,
    submittedAt: new Date(BASE_DATE + dayOffset * 86_400_000).toISOString(),
    answers,
  };
}

function shuffle<T>(items: T[], random: () => number) {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function buildFixtureDataset(): StudyDataset {
  const random = mulberry32(20261003);
  const respondents = [
    ...Array.from({ length: STUDENT_COUNT }, (_, i) => makeRespondent("student", i, random)),
    ...Array.from({ length: INSTRUCTOR_COUNT }, (_, i) => makeRespondent("instructor", i, random)),
  ];
  respondents.sort((a, b) => a.submittedAt.localeCompare(b.submittedAt) || a.id.localeCompare(b.id));

  const authors = shuffle(respondents, random);
  const comments: StudyComment[] = [];
  let cursor = 0;
  for (const { themeId, count, texts } of COMMENT_PLAN) {
    for (let i = 0; i < count; i++) {
      const author = authors[cursor++];
      comments.push({
        key: `${author.id}:helpful`,
        respondentId: author.id,
        role: author.role,
        promptId: "helpful",
        themeId,
        text: texts[i % texts.length],
      });
    }
  }

  return {
    respondents,
    comments,
    studentTarget: slovinSampleSize(POPULATION, MARGIN_OF_ERROR),
    instructorTarget: 11,
  };
}
