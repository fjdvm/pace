export function heartsSpentByStudent(states: { studentId: string; totalSpent: number }[]) {
  const totals = new Map<string, number>();
  for (const state of states) totals.set(state.studentId, (totals.get(state.studentId) ?? 0) + state.totalSpent);
  return totals;
}
