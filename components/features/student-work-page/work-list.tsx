import type { SubmissionStudentRow } from "@/components/features/instructor/submissions/types";
import { WorkRow } from "./work-row";

type WorkListProps = {
  assignmentId: string;
  dueDate: string;
  students: SubmissionStudentRow[];
};

export function WorkList({ assignmentId, dueDate, students }: WorkListProps) {
  if (students.length === 0) {
    return (
      <p className="rounded-lg border border-pace-line bg-white px-4 py-10 text-center text-sm text-pace-muted">
        No students are enrolled in the assigned classes yet.
      </p>
    );
  }
  return (
    <div className="flex flex-col overflow-hidden rounded-lg border border-pace-line">
      {students.map((student) => (
        <WorkRow key={student.studentId} assignmentId={assignmentId} dueDate={dueDate} student={student} />
      ))}
    </div>
  );
}
