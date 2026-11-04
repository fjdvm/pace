export function sortByDue<T extends { dueDate: string }>(items: T[]): T[] {
  return [...items].sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
}
