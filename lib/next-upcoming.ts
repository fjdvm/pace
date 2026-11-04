interface UpcomingCandidate {
  title: string;
  dueDate: string;
  status: string;
}

export function nextUpcoming<T extends UpcomingCandidate>(assignments: T[], now = new Date()): T | null {
  const open = assignments
    .filter((a) => a.status !== "submitted" && new Date(a.dueDate).getTime() >= now.getTime())
    .sort((x, y) => new Date(x.dueDate).getTime() - new Date(y.dueDate).getTime());
  return open[0] ?? null;
}

export function formatDueTime(dueIso: string) {
  return new Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "2-digit" }).format(new Date(dueIso));
}
