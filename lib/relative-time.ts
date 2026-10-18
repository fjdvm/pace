const MIN = 60_000;
const HOUR = 60 * MIN;
const DAY = 24 * HOUR;
const shortDate = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", timeZone: "UTC" });

function plural(value: number, unit: string) {
  return `${value} ${unit}${value === 1 ? "" : "s"} ago`;
}

export function formatRelative(iso: string, now = new Date()) {
  const elapsed = now.getTime() - new Date(iso).getTime();
  if (elapsed < MIN) return "just now";
  if (elapsed < HOUR) return plural(Math.floor(elapsed / MIN), "minute");
  if (elapsed < DAY) return plural(Math.floor(elapsed / HOUR), "hour");
  if (elapsed < 2 * DAY) return "yesterday";
  if (elapsed < 14 * DAY) return plural(Math.floor(elapsed / DAY), "day");
  return shortDate.format(new Date(iso));
}
