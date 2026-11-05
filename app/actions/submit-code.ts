"use server";

import { revalidatePath } from "next/cache";
import type { Prisma } from "@/lib/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { awardSubmissionXp, getTotalXp } from "@/lib/gamification";
import { createNotification } from "@/lib/notifications";
import { computeRiskScore } from "@/lib/risk-score";
import type { BehavioralSignals } from "@/lib/types/behavioral-signals";
import { requireStudentPost } from "@/lib/workspace/student-access";
import { executeTests } from "@/lib/workspace/execute-tests";
import {
  postScore,
  validateAnswers,
  type CodingAnswer,
} from "@/lib/workspace/answers";

export async function submitCode(
  assignmentId: string,
  code: string,
  behavioralSignals: BehavioralSignals,
  itemAnswers?: CodingAnswer[],
) {
  try {
    if (!assignmentId || typeof code !== "string")
      throw new Error("Post and code are required");
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("Unauthorized: You must be logged in");
    const post = await requireStudentPost(assignmentId, user.id);
    if (!post.items.length) throw new Error("Coding Item not found");
    const key = {
      studentId_assignmentId: { studentId: user.id, assignmentId },
    };
    if (await prisma.submission.findUnique({ where: key }))
      throw new Error("You have already turned in this Post");
    if (new Date() > post.dueDate)
      throw new Error("The submission deadline has passed");
    const answers = validateAnswers(
      post.items.map((i) => i.id),
      itemAnswers ?? [{ itemId: post.items[0].id, code }],
    );
    const graded = await Promise.all(
      answers.map(async (answer, index) => {
        const item = post.items[index];
        const results = await executeTests(
          item.language,
          answer.code,
          item.testCases,
        );
        if (results.some((r) => r.status.id === 13))
          throw new Error(
            "The test runner is unavailable. Your work has not been turned in; try again.",
          );
        return {
          ...answer,
          results,
          points: item.points,
          score: results.length
            ? (results.filter((r) => r.passed).length / results.length) * 100
            : 0,
        };
      }),
    );
    const score = postScore(graded);
    const first = graded[0];
    const submission = await prisma.$transaction(async (tx) => {
      await tx.$queryRaw`SELECT id FROM assignments WHERE id = ${assignmentId} FOR UPDATE`;
      if (await tx.submission.findUnique({ where: key }))
        throw new Error("You have already turned in this Post");
      const created = await tx.submission.create({
        data: {
          studentId: user.id,
          assignmentId,
          itemId: first.itemId,
          code: first.code,
          score,
          testResults: first.results as unknown as Prisma.InputJsonValue,
          behavioralSignals: {
            ...behavioralSignals,
            riskScore: computeRiskScore(behavioralSignals.events, {
              finalCodeLength: answers.reduce(
                (sum, a) => sum + a.code.length,
                0,
              ),
              keystrokeCount: behavioralSignals.keystrokeCount,
            }),
          } as unknown as Prisma.InputJsonValue,
          answers: {
            create: graded.map((a) => ({
              itemId: a.itemId,
              code: a.code,
              score: a.score,
              testResults: a.results as unknown as Prisma.InputJsonValue,
            })),
          },
        },
      });
      await tx.codeDraft.deleteMany({
        where: { studentId: user.id, assignmentId },
      });
      return created;
    });
    let reward;
    try {
      revalidatePath("/dashboard", "layout");
      const heartsState = await prisma.heartsState.findUnique({ where: key });
      const totalHintsUsed = heartsState?.totalSpent || 0;
      const events = await awardSubmissionXp(
        user.id,
        assignmentId,
        score,
        totalHintsUsed,
      );
      reward = {
        events,
        totalXp: await getTotalXp(user.id),
        heartsUsed: totalHintsUsed,
      };
      await createNotification({
        userId: user.id,
        type: "submission_graded",
        title: `${post.title} graded`,
        message: `You scored ${score}%.`,
        link: `/dashboard/assignments/${assignmentId}`,
      });
    } catch (error) {
      console.error("Submission saved; reward notification failed:", error);
    }
    const visibleAnswers = graded.map((a) => ({
      itemId: a.itemId,
      code: a.code,
      testResults: a.results.filter((r) => r.visible !== false),
    }));
    return {
      success: true,
      submission: {
        id: submission.id,
        code: first.code,
        score,
        testResults: visibleAnswers[0].testResults,
        submittedAt: submission.submittedAt.toISOString(),
      },
      answers: visibleAnswers,
      reward,
    };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Unknown error",
    };
  }
}
