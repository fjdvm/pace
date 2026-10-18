import { StudentTopBar } from "@/components/features/student/shared/student-top-bar";
import { greetingFor } from "@/lib/student-dates";
import type { InstructorHomeData } from "@/components/features/instructor/types";
import { NewAssignmentButton } from "./new-assignment-button";
import { StatCards } from "./stat-cards";
import { AssignmentsTable } from "./assignments-table";
import { ClassJoinCards } from "./class-join-cards";

export function InstructorHomeView({ data }: { data: InstructorHomeData }) {
  const classCount = data.classes.length;
  return (
    <>
      <StudentTopBar
        title={`${greetingFor()}, ${data.greetingName}`}
        subtitle={`${classCount} ${classCount === 1 ? "class" : "classes"} · ${data.studentCount} ${data.studentCount === 1 ? "student" : "students"}`}
        actions={<NewAssignmentButton />}
      />
      <main className="flex flex-1 flex-col gap-6 p-4 md:px-10 md:py-8">
        <StatCards stats={data.stats} />
        <AssignmentsTable classes={data.classes} assignments={data.assignments} />
        <ClassJoinCards classes={data.classes} />
      </main>
    </>
  );
}
