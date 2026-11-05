export function formatAway(secs: number, short = false) {
  const minutes = Math.floor(secs / 60);
  const rest = Math.round(secs % 60);
  if (minutes === 0) return `${rest} s`;
  return short || rest === 0 ? `${minutes} min` : `${minutes} min ${rest} s`;
}

export function formatClock(timestamp: number) {
  return new Date(timestamp).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
}
