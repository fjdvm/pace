export function hasStudentWork(counts: { codeDrafts: number; submissions: number; heartsStates: number; chatMessages: number }) {
  return counts.codeDrafts > 0 || counts.submissions > 0 || counts.heartsStates > 0 || counts.chatMessages > 0;
}
