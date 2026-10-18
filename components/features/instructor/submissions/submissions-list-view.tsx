import { StudentTopBar } from "@/components/features/student/shared/student-top-bar";
import { AssignmentsTable } from "@/components/features/instructor/home/assignments-table";
import type { InstructorAssignmentRow, InstructorClassSummary } from "@/components/features/instructor/types";

type SubmissionsListViewProps = {
  classes: InstructorClassSummary[];
  assignments: InstructorAssignmentRow[];
};

export function SubmissionsListView({ classes, assignments }: SubmissionsListViewProps) {
  return (
    <>
      <StudentTopBar title="Submissions" subtitle="Review scores, hearts and flags for each assignment" />
      <main className="flex flex-1 flex-col gap-6 p-4 md:px-10 md:py-8">
        <AssignmentsTable
          title="All assignments"
          classes={classes}
          assignments={assignments}
          emptyMessage="No assignments yet. Publish one to start collecting submissions."
        />
      </main>
    </>
  );
}
