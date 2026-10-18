import { CONSTRUCTS, PILOT_SIZE, SCALE_CUTOFF, type ConstructId } from "./questionnaire";
import type { ThemeTone } from "./themes";
import { cronbachAlpha, interpretMean, mannWhitney, mean, median, sampleSd } from "./stats";
import type { Respondent, StudyDataset, StudyRole } from "./dataset";

export type GroupStats = { mean: number; sd: number; label: string };
export type ItemStats = GroupStats & { n: number; distribution: number[] };

export type StudyResults = {
  responses: Record<StudyRole, { count: number; target: number }>;
  overall: { student: number; instructor: number; label: string };
  reliability: { basis: string; minAlpha: number | null; passes: boolean; constructs: { id: ConstructId; alpha: number }[] };
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
  items: { constructId: ConstructId; id: string; text: string; student: ItemStats; instructor: ItemStats }[];
  themes: { id: string; label: string; tone: ThemeTone; count: number }[];
  commentCount: number;
  uncodedCount: number;
};

export const NO_DATA = "No data";

const constructScore = (respondent: Respondent, id: ConstructId) => mean(respondent.answers[id]);

function describe(values: number[]): GroupStats {
  if (values.length === 0) return { mean: 0, sd: 0, label: NO_DATA };
  const m = mean(values);
  return { mean: m, sd: sampleSd(values), label: interpretMean(m) };
}

function describeItem(values: number[]): ItemStats {
  const distribution = [1, 2, 3, 4, 5].map((rating) =>
    values.length ? (values.filter((v) => v === rating).length / values.length) * 100 : 0,
  );
  return { ...describe(values), n: values.length, distribution };
}

function comparisonResult(p: number, studentMedian: number, instructorMedian: number, enough: boolean) {
  if (!enough) return "Not enough data";
  if (p >= 0.05) return "No significant difference";
  return studentMedian > instructorMedian ? "Students rate higher" : "Instructors rate higher";
}

function overallLabel(student: number, instructor: number, both: boolean) {
  if (!both) return NO_DATA;
  const a = interpretMean(student);
  return a === interpretMean(instructor) ? a : "Mixed";
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
  const minAlpha = reliabilitySample.length >= 2 ? Math.min(...alphas.map((a) => a.alpha)) : null;

  const overallStudent = mean(constructs.map((c) => c.student.mean));
  const overallInstructor = mean(constructs.map((c) => c.instructor.mean));

  const commentCounts = new Map<string, number>();
  for (const comment of dataset.comments) {
    for (const themeId of comment.themeIds) commentCounts.set(themeId, (commentCounts.get(themeId) ?? 0) + 1);
  }

  return {
    responses: {
      student: { count: students.length, target: dataset.studentTarget },
      instructor: { count: instructors.length, target: dataset.instructorTarget },
    },
    overall: {
      student: overallStudent,
      instructor: overallInstructor,
      label: overallLabel(overallStudent, overallInstructor, students.length > 0 && instructors.length > 0),
    },
    reliability: {
      basis: final ? `final, n = ${students.length}` : `pilot, n = ${reliabilitySample.length}`,
      minAlpha,
      passes: minAlpha !== null && alphas.every((a) => a.alpha >= SCALE_CUTOFF),
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
        result: comparisonResult(test.p, median(s), median(i), s.length > 0 && i.length > 0),
      };
    }),
    items: CONSTRUCTS.flatMap(({ id, items }) =>
      items.map((text, index) => ({
        constructId: id,
        id: `${id}${index + 1}`,
        text,
        student: describeItem(students.map((r) => r.answers[id][index])),
        instructor: describeItem(instructors.map((r) => r.answers[id][index])),
      })),
    ),
    themes: dataset.themes.map((theme) => ({ ...theme, count: commentCounts.get(theme.id) ?? 0 })),
    commentCount: dataset.comments.length,
    uncodedCount: dataset.comments.filter((c) => c.themeIds.length === 0).length,
  };
}
