export type WeekGroup<T> = { label: string; items: T[] };

function weekStart(date: Date) {
  const start = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  start.setDate(start.getDate() - start.getDay());
  return start.getTime();
}

export function groupByWeek<T extends { dueDate: string }>(items: T[]): WeekGroup<T>[] {
  if (items.length === 0) return [];
  const starts = items.map((item) => weekStart(new Date(item.dueDate)));
  const groups = new Map<number, T[]>();
  items.forEach((item, i) => groups.set(starts[i], [...(groups.get(starts[i]) ?? []), item]));
  const ascending = [...groups.keys()].sort((a, b) => a - b);
  return [...groups.entries()]
    .sort(([a], [b]) => b - a)
    .map(([start, list]) => ({
      label: `Week ${ascending.indexOf(start) + 1}`,
      items: [...list].sort((a, b) => new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime()),
    }));
}
