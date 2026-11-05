import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { getOrRegenerateHearts } from "@/lib/hearts";
import { StudentWorkspaceView } from "@/components/features/student/workspace/student-workspace-view";

interface PageProps {
  searchParams?: Promise<{ item?: string }>;
  params: Promise<{
    id: string;
  }>;
}

export async function AssignmentWorkspacePage({ params, searchParams }: PageProps) {
  const { id } = await params;
  const requestedItemId = (await searchParams)?.item;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const assignment = await prisma.assignment.findUnique({
    where: { id, isDraft: false },
    include: {
      instructor: {
        select: {
          email: true,
        },
      },
      items: { orderBy: { position: "asc" }, include: { testCases: true } },
    },
  });

  if (!assignment) {
    redirect("/dashboard");
  }

  const assignmentClasses = await prisma.assignmentClass.findMany({
    where: { assignmentId: id },
    select: { classId: true },
  });

  const classIds = assignmentClasses.map((ac) => ac.classId);

  const enrollment = await prisma.enrollment.findFirst({
    where: {
      studentId: user.id,
      classId: { in: classIds },
    },
    include: { class: { select: { id: true, name: true } } },
  });

  if (!enrollment) {
    redirect("/dashboard");
  }

  const heartsState = await getOrRegenerateHearts(user.id, id);

  const chatMessages = await prisma.chatMessage.findMany({
    where: {
      studentId: user.id,
      assignmentId: id,
    },
    orderBy: { createdAt: "asc" },
  });

  const codingItem = assignment.items[0];
  if (!codingItem) redirect("/dashboard");

  const formattedAssignment = {
    id: assignment.id,
    title: assignment.title,
    instructions: codingItem.instructions,
    language: codingItem.language,
    dueDate: assignment.dueDate.toISOString(),
    heartsCount: assignment.heartsCount,
    heartsRegenMinutes: assignment.heartsRegenMinutes,
    instructorEmail: assignment.instructor.email,
  };

  const formattedHearts = {
    currentCount: heartsState.currentCount,
    lastRegenAt: heartsState.lastRegenAt.toISOString(),
    totalSpent: heartsState.totalSpent,
  };

  const visibleTests = codingItem.testCases.filter((tc) => tc.visible);
  const formattedTestCases = visibleTests.map((tc) => ({
    id: tc.id,
    input: tc.input,
    expectedOutput: tc.expectedOutput,
  }));

  const formattedMessages = chatMessages.map((msg) => ({
    id: msg.id,
    role: msg.role as "user" | "assistant",
    content: msg.content,
    createdAt: msg.createdAt.toISOString(),
  }));

  const submission = await prisma.submission.findUnique({
    where: {
      studentId_assignmentId: {
        studentId: user.id,
        assignmentId: id,
      },
    },
    include: { answers: true },
  });

  const drafts = submission
    ? []
    : await prisma.codeDraft.findMany({
        where: { studentId: user.id, assignmentId: id },
      });
  const items = assignment.items.map((item) => {
    const answer = submission?.answers.find((a) => a.itemId === item.id);
    return {
      id: item.id,
      title: item.title,
      instructions: item.instructions,
      language: item.language,
      starterCode: item.starterCode,
      points: item.points,
      testCases: item.testCases
        .filter((t) => t.visible)
        .map((t) => ({
          id: t.id,
          input: t.input,
          expectedOutput: t.expectedOutput,
        })),
      hiddenTestCount: item.testCases.filter((t) => !t.visible).length,
      code:
        answer?.code ??
        (submission?.itemId === item.id ? submission.code : null) ??
        drafts.find((d) => d.itemId === item.id)?.code ??
        null,
      testResults:
        (
          (answer?.testResults ??
            (submission?.itemId === item.id
              ? submission.testResults
              : null)) as
            | import("@/components/features/assignments/types").TestRunResult[]
            | null
        )?.filter((r) => r.visible !== false) ?? null,
    };
  });

  const formattedSubmission = submission
    ? {
        id: submission.id,
        code: submission.code,
        score: submission.score,
        testResults: items[0].testResults,
        submittedAt: submission.submittedAt.toISOString(),
      }
    : null;

  return (
    <StudentWorkspaceView
      key={`${assignment.id}:${requestedItemId ?? "first"}`}
      initialItemId={requestedItemId}
      items={items}
      assignment={formattedAssignment}
      className={enrollment.class.name}
      classId={enrollment.class.id}
      hiddenTestCount={codingItem.testCases.length - visibleTests.length}
      initialHearts={formattedHearts}
      visibleTestCases={formattedTestCases}
      initialSubmission={formattedSubmission}
      initialChatMessages={formattedMessages}
      initialDraftCode={items[0].code ?? codingItem.starterCode}
    />
  );
}
