export type SubmissionStatus = "turned_in" | "graded" | "returned";
export type ItemGrade = { itemId: string; grade: number | null };

export function isLate(dueDate: Date | string, submittedAt: Date | string) {
  return new Date(submittedAt).getTime() > new Date(dueDate).getTime();
}

export function studentGrade(submission: {
  status: SubmissionStatus;
  finalGrade: number | null;
  feedback: string | null;
}) {
  return submission.status === "returned"
    ? { grade: submission.finalGrade, feedback: submission.feedback }
    : { grade: null, feedback: null };
}

export function validateGrade(
  items: { itemId: string; kind: string; points: number }[],
  grades: ItemGrade[],
  finalGrade: number | null,
  returning: boolean,
) {
  if (
    new Set(grades.map((g) => g.itemId)).size !== grades.length ||
    grades.some((g) => !items.some((i) => i.itemId === g.itemId))
  )
    throw new Error("Provide unique grades for this Post's Items");
  for (const item of items) {
    const grade = grades.find((g) => g.itemId === item.itemId)?.grade;
    if (
      grade != null &&
      (!Number.isFinite(grade) || grade < 0 || grade > item.points)
    )
      throw new Error("Item grade must be within its points");
    if (returning && item.kind === "short_answer" && grade == null)
      throw new Error("Grade every Short answer before returning");
    if (returning && grade == null)
      throw new Error("Grade every Item before returning");
  }
  const total = items.reduce((sum, i) => sum + i.points, 0);
  if (
    finalGrade !== null &&
    (!Number.isFinite(finalGrade) || finalGrade < 0 || finalGrade > total)
  )
    throw new Error("Final grade must be within the Post's points");
  return finalGrade ?? grades.reduce((sum, g) => sum + (g.grade ?? 0), 0);
}
