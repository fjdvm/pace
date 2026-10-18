"use client";

import { useState } from "react";
import { ClassCodePills } from "@/components/features/instructor/shared/class-code-pills";
import type { InstructorAssignmentRow, InstructorClassSummary } from "@/components/features/instructor/types";
import { AssignmentRow } from "./assignment-row";

type AssignmentsTableProps = {
  title?: string;
  classes: InstructorClassSummary[];
  assignments: InstructorAssignmentRow[];
  emptyMessage?: string;
};

const columns = ["Assignment", "Due", "Submitted", "Avg score", "Tutor", ""];

export function AssignmentsTable({ title = "Assignments", classes, assignments, emptyMessage }: AssignmentsTableProps) {
  const [selected, setSelected] = useState("all");
  const visible =
    selected === "all" ? assignments : assignments.filter((a) => a.classes.some((c) => c.id === selected));
  const indexOf = (a: InstructorAssignmentRow) => Math.max(0, classes.findIndex((c) => c.id === a.classes[0]?.id));

  return (
    <section className="overflow-hidden rounded-[20px] border-[1.5px] border-pace-line bg-white shadow-[0_3px_0_0_var(--color-pace-line)]">
      <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-5">
        <h2 className="text-[22px] font-bold tracking-[-0.01em] text-pace-ink">{title}</h2>
        <ClassCodePills classes={classes} selected={selected} onChange={setSelected} />
      </div>
      <div className="overflow-x-auto">
        <div className="grid min-w-[760px] grid-cols-[minmax(0,2.4fr)_1fr_1.4fr_0.8fr_0.9fr_1fr] gap-4 bg-pace-canvas px-6 py-2.5">
          {columns.map((c, i) => (
            <span key={i} className="text-[11px] font-bold uppercase tracking-[0.06em] text-pace-muted">
              {c}
            </span>
          ))}
        </div>
        {visible.length === 0 ? (
          <p className="border-t border-pace-line px-6 py-10 text-center text-sm text-pace-muted">
            {emptyMessage ?? "No assignments yet. Create one to get started."}
          </p>
        ) : (
          visible.map((a) => <AssignmentRow key={a.id} assignment={a} classIndex={indexOf(a)} />)
        )}
      </div>
    </section>
  );
}
