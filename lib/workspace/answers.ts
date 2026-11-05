export type CodingAnswer = { itemId: string; code: string };

export function validateAnswers(itemIds: string[], answers: CodingAnswer[]) {
  if (
    answers.length !== itemIds.length ||
    new Set(answers.map((a) => a.itemId)).size !== itemIds.length ||
    answers.some(
      (a) => !itemIds.includes(a.itemId) || typeof a.code !== "string",
    )
  ) {
    throw new Error("Provide exactly one answer for each Item in this Post");
  }
  return itemIds.map((id) => answers.find((a) => a.itemId === id)!);
}

export function postScore(answers: { score: number | null; points: number }[]) {
  const total = answers.reduce((sum, a) => sum + a.points, 0);
  return total === 0
    ? 0
    : Math.round(
        (answers.reduce((sum, a) => sum + (a.score ?? 0) * a.points, 0) / total) * 100,
      ) / 100;
}
