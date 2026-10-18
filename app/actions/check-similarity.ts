"use server";

import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import type { SupportedLanguage } from "@/lib/similarity/tokenizer";
import { computeSimilarityPairs } from "@/lib/similarity/assignment-pairs";

export type { SimilarityPair } from "@/lib/similarity/assignment-pairs";

export async function checkSimilarity(assignmentId: string) {
  try {
    if (!assignmentId) throw new Error("Assignment ID is required");

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Unauthorized: You must be logged in");

    const assignment = await prisma.assignment.findUnique({ where: { id: assignmentId } });
    if (!assignment) throw new Error("Assignment not found");
    if (assignment.createdBy !== user.id) {
      throw new Error("Unauthorized: You do not own this assignment");
    }

    const submissions = await prisma.submission.findMany({
      where: { assignmentId },
      select: { studentId: true, code: true },
    });

    const pairs = await computeSimilarityPairs(assignment.language as SupportedLanguage, submissions);

    return { success: true, pairs };
  } catch (err) {
    console.error("Similarity check error:", err);
    return {
      success: false,
      error: err instanceof Error ? err.message : "Unknown error",
    };
  }
}
