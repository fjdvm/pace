import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { getInstructorClasses } from "@/lib/instructor-classes";
import { encodeLineBreaks } from "@/lib/assignment-form";
import { AssignmentFormView } from "@/components/features/instructor/assignment-form/assignment-form-view";

type PageProps = { params: Promise<{ id: string }> };

function toDateTimeLocal(date: Date) {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export default async function EditAssignmentPage({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const assignment = await prisma.assignment.findUnique({
    where: { id },
    include: {
      classes: { select: { classId: true } },
      testCases: { orderBy: { id: "asc" } },
      _count: { select: { submissions: true } },
    },
  });
  if (!assignment || assignment.createdBy !== user.id) redirect("/dashboard/instructor");

  const classes = await getInstructorClasses(user.id);

  return (
    <AssignmentFormView
      classes={classes}
      assignmentId={assignment.id}
      locked={assignment._count.submissions > 0}
      initial={{
        title: assignment.title,
        instructions: assignment.instructions,
        language: assignment.language,
        dueDate: toDateTimeLocal(assignment.dueDate),
        heartsCount: assignment.heartsCount,
        heartsRegenMinutes: assignment.heartsRegenMinutes,
        classIds: assignment.classes.map((c) => c.classId),
        testCases: assignment.testCases.map((tc) => ({
          input: encodeLineBreaks(tc.input),
          expectedOutput: encodeLineBreaks(tc.expectedOutput),
          visible: tc.visible,
        })),
      }}
    />
  );
}
