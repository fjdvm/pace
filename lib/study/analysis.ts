import { CONSTRUCTS, PILOT_SIZE, SCALE_CUTOFF, THEMES, type ConstructId, type ThemeTone } from "./questionnaire";
import { cronbachAlpha, interpretMean, mannWhitney, mean, median, sampleSd } from "./stats";
import type { Respondent, StudyDataset, StudyRole } from "./dataset";

export type GroupStats = { mean: number; sd: number; label: string };

export type StudyResults = {
  responses: Record<StudyRole, { count: number; target: number }>;
  overall: { student: number; instructor: number; label: string };
  reliability: { basis: string; minAlpha: number; passes: boolean; constructs: { id: ConstructId; alpha: number }[] };
  constructs: { id: ConstructId; name: string; student: GroupStats; instructor: GroupStats }[];
  comparison: {
    id: ConstructId;
    studentMedian: number;
    instructorMedian: number;
    u: number;
    p: number;
    r: number;
    result: string;
  }[];
  items: { constructId: ConstructId; text: string; student: GroupStats; instructor: GroupStats }[];
  themes: { id: string; label: string; tone: ThemeTone; count: number }[];
  commentCount: number;
};

const constructScore = (respondent: Respondent, id: ConstructId) => mean(respondent.answers[id]);

function describe(values: number[]): GroupStats {
  const m = mean(values);
  return { mean: m, sd: sampleSd(values), label: interpretMean(m) };
}

function comparisonResult(p: number, studentMedian: number, instructorMedian: number) {
  if (p >= 0.05) return "No significant difference";
  return studentMedian > instructorMedian ? "Students rate higher" : "Instructors rate higher";
}

export function analyzeStudy(dataset: StudyDataset, { final }: { final: boolean }): StudyResults {
  const students = dataset.respondents.filter((r) => r.role === "student");
  const instructors = dataset.respondents.filter((r) => r.role === "instructor");
  const reliabilitySample = final ? students : students.slice(0, PILOT_SIZE);

  const constructs = CONSTRUCTS.map(({ id, name }) => ({
    id,
    name,
    student: describe(students.map((r) => constructScore(r, id))),
    instructor: describe(instructors.map((r) => constructScore(r, id))),
  }));

  const alphas = CONSTRUCTS.map(({ id }) => ({ id, alpha: cronbachAlpha(reliabilitySample.map((r) => r.answers[id])) }));
  const minAlpha = alphas.length ? Math.min(...alphas.map((a) => a.alpha)) : 0;

  const overallStudent = mean(constructs.map((c) => c.student.mean));
  const overallInstructor = mean(constructs.map((c) => c.instructor.mean));

  const commentCounts = new Map<string, number>();
  for (const comment of dataset.comments) {
    commentCounts.set(comment.themeId, (commentCounts.get(comment.themeId) ?? 0) + 1);
  }

  return {
    responses: {
      student: { count: students.length, target: dataset.studentTarget },
      instructor: { count: instructors.length, target: dataset.instructorTarget },
    },
    overall: {
      student: overallStudent,
      instructor: overallInstructor,
      label: interpretMean(Math.min(overallStudent, overallInstructor)) === interpretMean(Math.max(overallStudent, overallInstructor))
        ? interpretMean(overallStudent)
        : "Mixed",
    },
    reliability: {
      basis: final ? `final, n = ${students.length}` : `pilot, n = ${reliabilitySample.length}`,
      minAlpha,
      passes: alphas.every((a) => a.alpha >= SCALE_CUTOFF),
      constructs: alphas,
    },
    constructs,
    comparison: CONSTRUCTS.map(({ id }) => {
      const s = students.map((r) => constructScore(r, id));
      const i = instructors.map((r) => constructScore(r, id));
      const test = mannWhitney(s, i);
      return {
        id,
        studentMedian: median(s),
        instructorMedian: median(i),
        u: test.u,
        p: test.p,
        r: test.r,
        result: comparisonResult(test.p, median(s), median(i)),
      };
    }),
    items: CONSTRUCTS.flatMap(({ id, items }) =>
      items.map((text, index) => ({
        constructId: id,
        text,
        student: describe(students.map((r) => r.answers[id][index])),
        instructor: describe(instructors.map((r) => r.answers[id][index])),
      })),
    ),
    themes: THEMES.map((theme) => ({ ...theme, count: commentCounts.get(theme.id) ?? 0 })),
    commentCount: dataset.comments.length,
  };
}
