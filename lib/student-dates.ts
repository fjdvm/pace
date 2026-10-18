const DAY_MS = 24 * 60 * 60 * 1000;

function startOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function dayDiff(due: Date, now: Date) {
  return Math.round((startOfDay(due).getTime() - startOfDay(now).getTime()) / DAY_MS);
}

const timeFormat = new Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "2-digit" });
const weekdayDate = new Intl.DateTimeFormat("en-US", { weekday: "short", month: "short", day: "numeric" });
const shortDate = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" });

export function formatDueLong(dueIso: string, now = new Date()) {
  const due = new Date(dueIso);
  const diff = dayDiff(due, now);
  if (diff === 0) return `Today, ${timeFormat.format(due)}`;
  if (diff === 1) return `Tomorrow, ${timeFormat.format(due)}`;
  if (diff < 0) return `Overdue · ${shortDate.format(due)}`;
  return weekdayDate.format(due);
}

export function formatDueShort(dueIso: string, now = new Date()) {
  const due = new Date(dueIso);
  const diff = dayDiff(due, now);
  if (diff === 0) return "Today";
  if (diff === 1) return "Tomorrow";
  return shortDate.format(due);
}

export function isUrgent(dueIso: string, now = new Date()) {
  return dayDiff(new Date(dueIso), now) <= 1;
}

export function isDueWithin48Hours(dueIso: string, now = new Date()) {
  const diff = new Date(dueIso).getTime() - now.getTime();
  return diff <= 2 * DAY_MS;
}

export function isDueThisWeek(dueIso: string, now = new Date()) {
  const diff = dayDiff(new Date(dueIso), now);
  return diff > 1 && diff <= 7;
}

export function formatSubmitted(iso: string) {
  return `Submitted ${shortDate.format(new Date(iso))}`;
}

export function greetingFor(now = new Date()) {
  const hour = now.getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

export function formatToday(now = new Date()) {
  return new Intl.DateTimeFormat("en-US", { weekday: "long", month: "long", day: "numeric" }).format(now);
}
