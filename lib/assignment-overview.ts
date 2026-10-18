export type FlagTone = "amber" | "red";

export function scoreBands(scores: number[]) {
  return scores.reduce(
    (bands, score) => {
      if (score >= 70) bands.high++;
      else if (score >= 40) bands.mid++;
      else bands.low++;
      return bands;
    },
    { high: 0, mid: 0, low: 0 },
  );
}

export function median(values: number[]) {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0 ? Math.round((sorted[mid - 1] + sorted[mid]) / 2) : sorted[mid];
}

const HEART_BUCKETS = [
  { label: "0 hearts", matches: (n: number) => n === 0 },
  { label: "1–3", matches: (n: number) => n >= 1 && n <= 3 },
  { label: "4+", matches: (n: number) => n >= 4 },
];

export function averageByHeartsBucket(rows: { score: number; hearts: number }[]) {
  return HEART_BUCKETS.map(({ label, matches }) => {
    const scores = rows.filter((r) => matches(r.hearts)).map((r) => r.score);
    return { label, average: scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : null };
  });
}

type TestSummary = { id: string; input: string; visible: boolean };
type TestOutcome = { testCaseId: string; passed: boolean };

export function mostFailedTest(testCases: TestSummary[], results: TestOutcome[][]) {
  const failures = new Map<string, number>();
  for (const outcomes of results) {
    for (const outcome of outcomes) {
      if (!outcome.passed) failures.set(outcome.testCaseId, (failures.get(outcome.testCaseId) ?? 0) + 1);
    }
  }
  let worst: { id: string; count: number } | null = null;
  for (const [id, count] of failures) {
    if (!worst || count > worst.count) worst = { id, count };
  }
  if (!worst) return null;
  const index = testCases.findIndex((t) => t.id === worst.id);
  if (index === -1) return null;
  return { label: `${testCases[index].visible ? "test" : "hidden test"} ${index + 1}`, count: worst.count };
}

export function studentStatus({ submitted, started }: { submitted: boolean; started: boolean }) {
  if (submitted) return "submitted" as const;
  return started ? ("in-progress" as const) : ("not-started" as const);
}

const LARGE_PASTE = 0.6;

export function buildFlags({
  similarity,
  riskFlag,
  pasteDominance,
}: {
  similarity: number | null;
  riskFlag: "Low" | "Medium" | "High" | null;
  pasteDominance: number;
}) {
  const flags: { label: string; tone: FlagTone }[] = [];
  if (similarity !== null) flags.push({ label: `Similar ${Math.round(similarity * 100)}%`, tone: "amber" });
  if (pasteDominance >= LARGE_PASTE) flags.push({ label: "Large paste", tone: "red" });
  else if (riskFlag === "High" || riskFlag === "Medium") {
    flags.push({ label: `Risk: ${riskFlag}`, tone: riskFlag === "High" ? "red" : "amber" });
  }
  return flags;
}

function escapeCell(value: string | number) {
  const text = String(value);
  return /[",\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

export function toCsv(rows: (string | number)[][]) {
  return rows.map((row) => row.map(escapeCell).join(",")).join("\n");
}
