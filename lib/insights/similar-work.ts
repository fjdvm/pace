import type { SimilarityPair } from "@/lib/similarity/assignment-pairs";

export const SIMILAR_WORK_THRESHOLD = 0.8;

export function mostSimilarTo(
  pairs: SimilarityPair[],
  studentId: string,
  threshold = SIMILAR_WORK_THRESHOLD,
) {
  const own = pairs
    .filter((p) => p.studentAId === studentId || p.studentBId === studentId)
    .filter((p) => p.similarity >= threshold)
    .sort((a, b) => b.similarity - a.similarity)[0];
  if (!own) return null;
  return { studentId: own.studentAId === studentId ? own.studentBId : own.studentAId, similarity: own.similarity };
}
