"use client";

import { useState } from "react";
import type { SubmissionStudentRow } from "./types";
import { StudentRow, studentGrid } from "./student-row";

const PAGE_SIZE = 10;
const columns = ["Student", "Status", "Score", "Hearts", "Flags"];

type StudentsTableProps = {
  assignmentId: string;
  students: SubmissionStudentRow[];
};

export function StudentsTable({ assignmentId, students }: StudentsTableProps) {
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const visible = students.slice(0, visibleCount);

  return (
    <section className="overflow-hidden rounded-[20px] border-[1.5px] border-pace-line bg-white shadow-[0_3px_0_0_var(--color-pace-line)]">
      <div className="overflow-x-auto">
        <div className={`${studentGrid} bg-pace-canvas py-2.5`}>
          {columns.map((c) => (
            <span key={c} className="text-[11px] font-bold uppercase tracking-[0.06em] text-pace-muted">
              {c}
            </span>
          ))}
        </div>
        {visible.length === 0 ? (
          <p className="border-t border-pace-line px-6 py-10 text-center text-sm text-pace-muted">
            No students are enrolled in the assigned classes yet.
          </p>
        ) : (
          visible.map((student) => <StudentRow key={student.studentId} assignmentId={assignmentId} student={student} />)
        )}
      </div>
      <div className="flex items-center justify-between border-t border-pace-line px-6 py-3 text-xs text-pace-muted">
        <span>
          Showing {visible.length} of {students.length} students
        </span>
        {visibleCount < students.length && (
          <button
            type="button"
            onClick={() => setVisibleCount((n) => n + PAGE_SIZE)}
            className="cursor-pointer font-semibold text-pace-ink"
          >
            Show more
          </button>
        )}
      </div>
    </section>
  );
}
