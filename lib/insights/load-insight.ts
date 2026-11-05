import { prisma } from "@/lib/prisma";
import { getDisplayName } from "@/lib/display-name";
import { computeSimilarityPairs } from "@/lib/similarity/assignment-pairs";
import type { SupportedLanguage } from "@/lib/similarity/tokenizer";
import type { StoredBehavioralSignals } from "@/lib/types/behavioral-signals";
import { buildItemActivity, type ItemActivity } from "./activity";
import { itemRisk } from "./item-risk";
import { mostSimilarTo } from "./similar-work";
import type { InsightFacts } from "./next-steps";

export interface LoadedInsight {
  activity: ItemActivity;
  flag: "Low" | "Medium" | "High";
  facts: InsightFacts;
  similarName: string | null;
  similarStudentId: string | null;
  itemNumber: number;
}

export async function loadItemInsight(postId: string, studentId: string, itemId: string): Promise<LoadedInsight | null> {
  const post = await prisma.assignment.findUnique({
    where: { id: postId },
    include: {
      items: { orderBy: { position: "asc" } },
      submissions: { include: { student: true, answers: true } },
    },
  });
  const submission = post?.submissions.find((s) => s.studentId === studentId);
  const item = post?.items.find((i) => i.id === itemId);
  if (!post || !submission || !item) return null;
  const answer = submission.answers.find((a) => a.itemId === itemId);
  const code = answer?.code ?? "";
  const signals = (submission.behavioralSignals ?? {}) as unknown as StoredBehavioralSignals;
  const events = signals.events ?? [];
  const firstItemId = post.items[0].id;
  const questions = await prisma.chatMessage.findMany({
    where: { studentId, assignmentId: postId, itemId, role: "user" },
    select: { createdAt: true },
  });
  const activity = buildItemActivity({
    events,
    legacyKeystrokes: signals.keystrokeCount ?? 0,
    tutorQuestions: questions.map((q) => q.createdAt.getTime()),
    itemId,
    firstItemId,
    fileName: item.language === "Python" ? "main.py" : "main",
    finalCodeLength: code.length,
  });
  const flag = itemRisk(events, itemId, firstItemId, code.length, activity.typed).flag;
  let similar: { name: string; percent: number } | null = null;
  let similarStudentId: string | null = null;
  if (item.kind === "coding") {
    const answers = post.submissions.flatMap((s) => {
      const a = s.answers.find((x) => x.itemId === itemId);
      return a ? [{ studentId: s.studentId, code: a.code }] : [];
    });
    const top = mostSimilarTo(await computeSimilarityPairs(item.language as SupportedLanguage, answers), studentId);
    const other = top && post.submissions.find((s) => s.studentId === top.studentId);
    if (top && other) similarStudentId = top.studentId;
    if (top && other) similar = { name: getDisplayName(other.student), percent: Math.round(top.similarity * 100) };
  }
  const results = (answer?.testResults ?? []) as { passed: boolean }[];
  const student = getDisplayName(submission.student);
  const itemNumber = post.items.findIndex((i) => i.id === itemId) + 1;
  return {
    activity,
    flag,
    similarName: similar?.name ?? null,
    similarStudentId,
    itemNumber,
    facts: {
      studentFirstName: student.split(" ")[0],
      itemNumber,
      flag,
      typed: activity.typed,
      pasted: activity.pasted,
      pastePercent: activity.pastePercent,
      tabLeaves: activity.tabLeaves,
      awaySecs: activity.awaySecs,
      tutorQuestions: questions.length,
      testsPassed: item.kind === "coding" ? results.filter((r) => r.passed).length : null,
      testsTotal: item.kind === "coding" ? results.length : null,
      similarTo: similar,
    },
  };
}
