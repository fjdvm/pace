const DAY_MS = 24 * 60 * 60 * 1000;
const shortDate = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" });

function dayDiff(due: Date, now: Date) {
  const start = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
  return Math.round((start(due) - start(now)) / DAY_MS);
}

export function describeInstructorDue(dueIso: string, now = new Date()) {
  const due = new Date(dueIso);
  if (due.getTime() < now.getTime()) return { label: `Closed ${shortDate.format(due)}`, tone: "closed" as const };
  const diff = dayDiff(due, now);
  if (diff === 0) return { label: "Today", tone: "urgent" as const };
  if (diff === 1) return { label: "Tomorrow", tone: "urgent" as const };
  return { label: shortDate.format(due), tone: "normal" as const };
}

export function isDueWithinWeek(dueIso: string, now = new Date()) {
  const due = new Date(dueIso).getTime();
  return due >= now.getTime() && due - now.getTime() <= 7 * DAY_MS;
}
