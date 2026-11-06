import { FREQUENCY_LABELS, LIKERT_LABELS, ROLE_ITEMS } from "./questionnaire";
import type { Item, ItemGroup, ProfileQuestion, Setup, StudyRole } from "./items/types";

export type Sitting = 1 | 2;
export type Scale = "frequency" | "agreement";
export type StepId = "about" | "problems" | "acceptability" | "features" | "comments";

type SectionBase = { id: StepId; part: string; title: string; subtitle?: string };
export type ProfileSection = SectionBase & { kind: "profile"; questions: ProfileQuestion[] };
export type RatingsSection = SectionBase & { kind: "ratings"; scale: Scale; setup: Setup; groups: ItemGroup[] };
export type CommentsSection = SectionBase & { kind: "comments" };
export type FormSection = ProfileSection | RatingsSection | CommentsSection;

export type SittingForm = {
  role: StudyRole;
  sitting: Sitting;
  setup: Setup;
  title: string;
  intro: string;
  progressLabel: string;
  steps: { id: StepId; label: string }[];
  sections: FormSection[];
  total: number;
  submitHint: string;
  submitLabel: string;
};

const STEP_LABELS: Record<StepId, string> = {
  about: "About you",
  problems: "Problems",
  acceptability: "Acceptability",
  features: "PACE features",
  comments: "Comments",
};

const INTRO: Record<StudyRole, string> = {
  student: "Answer based on how you have completed programming assignments so far, using your LMS, IDE, and any AI tools.",
  instructor: "Answer based on how you have handled programming assignments so far, using your LMS, IDE, and any other tools.",
};

const PACE_INTRO = "Answer based on your PACE sessions. These are the same statements you rated for your current workflow.";

function problemsSection(setup: Setup, groups: ItemGroup[]): RatingsSection {
  const current = setup === "current";
  return {
    kind: "ratings",
    id: "problems",
    part: "PART II",
    title: current ? "Problems in your current workflow" : "Problems while using PACE",
    subtitle: current
      ? "How often does each of these happen in your current workflow?"
      : "How often did each of these happen while you used PACE?",
    scale: "frequency",
    setup,
    groups,
  };
}

function acceptabilitySection(setup: Setup, groups: ItemGroup[]): RatingsSection {
  const meaning = setup === "current" ? "your current workflow" : "PACE";
  return {
    kind: "ratings",
    id: "acceptability",
    part: "PART III",
    title: setup === "current" ? "Acceptability of your current workflow" : "Acceptability of PACE",
    subtitle: `How much do you agree with each statement? "This setup" means ${meaning}.`,
    scale: "agreement",
    setup,
    groups,
  };
}

function featuresSection(role: StudyRole, features: Item[]): RatingsSection {
  return {
    kind: "ratings",
    id: "features",
    part: role === "student" ? "PART III-C" : "PART III-D",
    title: "PACE's features",
    subtitle: "These are about PACE only.",
    scale: "agreement",
    setup: "pace",
    groups: [{ label: "", items: features }],
  };
}

const commentsSection: CommentsSection = { kind: "comments", id: "comments", part: "PART IV", title: "Comments and suggestions", subtitle: "Optional." };

function countRequired(sections: FormSection[]) {
  return sections.reduce((sum, section) => {
    if (section.kind === "profile") return sum + section.questions.length;
    if (section.kind === "ratings") return sum + section.groups.reduce((n, g) => n + g.items.length, 0);
    return sum;
  }, 0);
}

export function buildSittingForm(role: StudyRole, sitting: Sitting): SittingForm {
  const items = ROLE_ITEMS[role];
  const first = sitting === 1;
  const setup: Setup = first ? "current" : "pace";
  const sections: FormSection[] = first
    ? [
        { kind: "profile", id: "about", part: "PART I", title: "About you", questions: items.profile },
        problemsSection(setup, items.problems),
        acceptabilitySection(setup, items.acceptability),
      ]
    : [
        problemsSection(setup, items.problems),
        acceptabilitySection(setup, items.acceptability),
        featuresSection(role, items.features),
        commentsSection,
      ];
  const total = countRequired(sections);

  return {
    role,
    sitting,
    setup,
    title: first ? "Sitting 1 · Your current workflow" : "Sitting 2 · PACE",
    intro: first ? INTRO[role] : PACE_INTRO,
    progressLabel: `${role === "student" ? "Student" : "Instructor"} · Sitting ${sitting}`,
    steps: sections.map((s) => ({ id: s.id, label: STEP_LABELS[s.id] })),
    sections,
    total,
    submitHint: first
      ? "Answer all statements to save. Come back for Sitting 2 after your PACE sessions."
      : `Answer all ${total} statements to submit. You can't edit your answers afterward.`,
    submitLabel: first ? "Save Sitting 1" : "Submit answers",
  };
}

export function ratingCodes(form: SittingForm) {
  return form.sections.flatMap((s) => (s.kind === "ratings" ? s.groups.flatMap((g) => g.items.map((i) => i.code)) : []));
}

export const scaleLabels = (scale: Scale) => (scale === "frequency" ? FREQUENCY_LABELS : LIKERT_LABELS);
