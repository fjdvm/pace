import { tokenize, type SupportedLanguage } from "./tokenizer";
import { computeSimilarity } from "./winnowing";

export const SIMILARITY_THRESHOLD = 0.4;

export interface SimilarityPair {
  studentAId: string;
  studentBId: string;
  similarity: number;
}

export async function computeSimilarityPairs(
  language: SupportedLanguage,
  submissions: { studentId: string; code: string }[],
): Promise<SimilarityPair[]> {
  const tokenized = await Promise.all(
    submissions.map(async (s) => ({ studentId: s.studentId, tokens: await tokenize(s.code, language) })),
  );

  const pairs: SimilarityPair[] = [];
  for (let i = 0; i < tokenized.length; i++) {
    for (let j = i + 1; j < tokenized.length; j++) {
      const similarity = computeSimilarity(tokenized[i].tokens, tokenized[j].tokens);
      if (similarity >= SIMILARITY_THRESHOLD) {
        pairs.push({ studentAId: tokenized[i].studentId, studentBId: tokenized[j].studentId, similarity });
      }
    }
  }
  return pairs.sort((a, b) => b.similarity - a.similarity);
}
