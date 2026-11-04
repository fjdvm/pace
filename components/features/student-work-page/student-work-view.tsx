import { SetClassTitle } from "@/components/features/dashboard/top-bar/class-title-context";
import { ClassInsightsCard } from "@/components/features/instructor/submissions/class-insights-card";
import { SimilarityCard } from "@/components/features/instructor/submissions/similarity-card";
import type { AssignmentOverview } from "@/components/features/instructor/submissions/types";
import { WorkHeader } from "./work-header";
import { WorkList } from "./work-list";
import { WorkStats } from "./work-stats";
import { WorkTabs } from "./work-tabs";

export function StudentWorkView({ overview }: { overview: AssignmentOverview }) {
  const { assignment, stats, students } = overview;
  return (
    <>
      {assignment.primaryClass && <SetClassTitle id={assignment.primaryClass.id} name={assignment.primaryClass.name} />}
      <WorkTabs assignmentId={assignment.id} />
      <div className="mx-auto flex w-full max-w-[860px] flex-col gap-3 p-4 md:gap-4 md:px-0 md:py-6">
        <WorkHeader overview={overview} />
        <WorkStats turnedIn={stats.submitted} assigned={stats.total} />
        <p className="hidden rounded-lg bg-pace-amber-tint px-4 py-3 text-[13px] leading-normal text-pace-ink-2 md:block">
          Activity flags show how code was written (typing, pasting, tab switches). A flag means &ldquo;worth a look&rdquo;, not proof of copying.
        </p>
        <WorkList assignmentId={assignment.id} dueDate={assignment.dueDate} students={students} />
        <p className="text-[13px] leading-normal text-pace-muted md:hidden">
          Activity flags show how code was written. A flag means &ldquo;worth a look&rdquo;, not proof of copying.
        </p>
        <div className="mt-2 flex flex-col gap-5">
          <SimilarityCard assignmentId={assignment.id} pairs={overview.pairs} />
          <ClassInsightsCard overview={overview} />
        </div>
      </div>
    </>
  );
}
