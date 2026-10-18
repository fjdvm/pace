import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { getOrRegenerateHearts } from "@/lib/hearts";
import { StudentWorkspaceView } from "@/components/features/student/workspace/student-workspace-view";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function AssignmentWorkspacePage({ params }: PageProps) {
  const { id } = await params;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const assignment = await prisma.assignment.findUnique({
    where: { id },
    include: {
      instructor: {
        select: {
          email: true,
        },
      },
      testCases: true,
    },
  });

  if (!assignment) {
    redirect("/dashboard/student");
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
    redirect("/dashboard/student");
  }

  const heartsState = await getOrRegenerateHearts(user.id, id);

  const chatMessages = await prisma.chatMessage.findMany({
    where: {
      studentId: user.id,
      assignmentId: id,
    },
    orderBy: { createdAt: "asc" },
  });

  const formattedAssignment = {
    id: assignment.id,
    title: assignment.title,
    instructions: assignment.instructions,
    language: assignment.language,
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

  const visibleTests = assignment.testCases.filter((tc) => tc.visible);
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
  });

  const draft = submission
    ? null
    : await prisma.codeDraft.findUnique({
        where: {
          studentId_assignmentId: {
            studentId: user.id,
            assignmentId: id,
          },
        },
      });

  const formattedSubmission = submission
    ? {
        id: submission.id,
        code: submission.code,
        score: submission.score,
        testResults: submission.testResults as any,
        submittedAt: submission.submittedAt.toISOString(),
      }
    : null;

  return (
    <StudentWorkspaceView
      assignment={formattedAssignment}
      className={enrollment.class.name}
      classId={enrollment.class.id}
      hiddenTestCount={assignment.testCases.length - visibleTests.length}
      initialHearts={formattedHearts}
      visibleTestCases={formattedTestCases}
      initialSubmission={formattedSubmission}
      initialChatMessages={formattedMessages}
      initialDraftCode={draft?.code ?? null}
    />
  );
}
