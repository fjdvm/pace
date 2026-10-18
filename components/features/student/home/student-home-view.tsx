"use client";

import { StudentTopBar } from "@/components/features/student/shared/student-top-bar";
import { greetingFor, formatToday, isDueThisWeek, isDueWithin48Hours } from "@/lib/student-dates";
import type { StudentHomeData } from "@/components/features/student/types";
import { ContinueCard } from "./continue-card";
import { DueSoonCard } from "./due-soon-card";
import { ClassCards } from "./class-cards";
import { WeekCard } from "./week-card";
import { JoinClassCard } from "./join-class-card";
import { TutorTipCard } from "./tutor-tip-card";

export function StudentHomeView({ data }: { data: StudentHomeData }) {
  const active = data.classes.filter((c) => !c.archived);
  const open = active
    .flatMap((c) => c.assignments)
    .filter((a) => a.status !== "submitted")
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
  const featured = open.find((a) => a.status === "in progress") ?? open[0];
  const dueThisWeek = open.filter((a) => isDueWithin48Hours(a.dueDate) || isDueThisWeek(a.dueDate)).length;
  const now = new Date();

  return (
    <>
      <StudentTopBar
        title={`${greetingFor(now)}, ${data.firstName}`}
        subtitle={`${formatToday(now)} · ${dueThisWeek} ${dueThisWeek === 1 ? "assignment" : "assignments"} due this week`}
      />
      <main className="flex flex-1 flex-col gap-6 p-4 md:px-10 md:py-8 lg:flex-row lg:items-start">
        <div className="flex min-w-0 flex-1 flex-col gap-6">
          {featured && <ContinueCard assignment={featured} />}
          <DueSoonCard assignments={open.slice(0, 3)} />
          <ClassCards classes={active} />
        </div>
        <aside className="flex w-full shrink-0 flex-col gap-5 lg:w-80">
          <WeekCard activeDays={data.activeDays} xp={data.xp} />
          <JoinClassCard />
          <TutorTipCard />
        </aside>
      </main>
    </>
  );
}
