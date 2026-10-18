"use client";

import { useMemo, useState } from "react";
import { StudentTopBar } from "@/components/features/student/shared/student-top-bar";
import { isDueWithin48Hours } from "@/lib/student-dates";
import type { StudentAssignment, StudentClass } from "@/components/features/student/types";
import { ClassFilterPills } from "./class-filter-pills";
import { TodoSection } from "./todo-section";
import { TodoRow, SubmittedRow } from "./todo-row";

function byDue(a: StudentAssignment, b: StudentAssignment) {
  return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
}

export function StudentTodoView({ classes }: { classes: StudentClass[] }) {
  const [selected, setSelected] = useState("all");
  const active = classes.filter((c) => !c.archived);

  const { soon, later, submitted } = useMemo(() => {
    const all = active
      .filter((c) => selected === "all" || c.id === selected)
      .flatMap((c) => c.assignments);
    const open = all.filter((a) => a.status !== "submitted").sort(byDue);
    return {
      soon: open.filter((a) => isDueWithin48Hours(a.dueDate)),
      later: open.filter((a) => !isDueWithin48Hours(a.dueDate)),
      submitted: all
        .filter((a) => a.status === "submitted")
        .sort((a, b) => (b.submittedAt ?? "").localeCompare(a.submittedAt ?? ""))
        .slice(0, 5),
    };
  }, [active, selected]);

  const empty = soon.length + later.length === 0;

  return (
    <>
      <StudentTopBar title="To-do" subtitle="Everything you still need to submit, soonest first" />
      <main className="flex flex-1 flex-col gap-6 p-4 md:px-10 md:py-8">
        {active.length > 0 && <ClassFilterPills classes={active} selected={selected} onChange={setSelected} />}
        <TodoSection title="Due in 48 hours" count={soon.length} tone="red">
          {soon.map((a) => (
            <TodoRow key={a.id} assignment={a} />
          ))}
        </TodoSection>
        <TodoSection title="This week" count={later.length} tone="neutral">
          {later.map((a) => (
            <TodoRow key={a.id} assignment={a} />
          ))}
        </TodoSection>
        {empty && (
          <p className="rounded-2xl border-[1.5px] border-pace-line bg-white p-8 text-center text-[13px] text-pace-ink-2">
            You&apos;re all caught up. No pending assignments right now.
          </p>
        )}
        <TodoSection title="Recently submitted" count={submitted.length} tone="green">
          {submitted.map((a) => (
            <SubmittedRow key={a.id} assignment={a} />
          ))}
        </TodoSection>
      </main>
    </>
  );
}
