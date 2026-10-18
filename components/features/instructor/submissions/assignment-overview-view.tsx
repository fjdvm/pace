import Link from "next/link";
import { StudentTopBar } from "@/components/features/student/shared/student-top-bar";
import { formatDueSentence } from "@/lib/student-dates";
import { OverviewStatCards } from "./overview-stat-cards";
import { StudentsTable } from "./students-table";
import { ClassInsightsCard } from "./class-insights-card";
import { SimilarityCard } from "./similarity-card";
import { ExportScoresButton } from "./export-scores-button";
import type { AssignmentOverview } from "./types";

export function AssignmentOverviewView({ overview }: { overview: AssignmentOverview }) {
  const { assignment } = overview;
  return (
    <>
      <StudentTopBar
        title={assignment.title}
        subtitle={`${assignment.classCodes} · ${assignment.language} · ${formatDueSentence(assignment.dueDate)}`}
        backHref="/dashboard/instructor/submissions"
        actions={
          <div className="flex items-center gap-3">
            <Link
              href={`/dashboard/instructor/assignments/${assignment.id}/edit`}
              className="hidden px-2 text-[13px] font-semibold text-pace-ink sm:block"
            >
              Edit assignment
            </Link>
            <ExportScoresButton overview={overview} />
          </div>
        }
      />
      <main className="flex flex-1 flex-col gap-5 p-4 md:px-8 md:py-6">
        <OverviewStatCards overview={overview} />
        <div className="flex flex-col gap-5 xl:flex-row xl:items-start">
          <div className="min-w-0 flex-1">
            <StudentsTable assignmentId={assignment.id} students={overview.students} />
          </div>
          <aside className="flex w-full shrink-0 flex-col gap-5 xl:w-[380px]">
            <ClassInsightsCard overview={overview} />
            <SimilarityCard assignmentId={assignment.id} pairs={overview.pairs} />
          </aside>
        </div>
      </main>
    </>
  );
}
