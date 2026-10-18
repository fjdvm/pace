import { BarChart3, CircleAlert } from "lucide-react";
import { ScoreDistribution } from "./score-distribution";
import { HeartsScoreTiles } from "./hearts-score-tiles";
import { AiSummaryCard } from "./ai-summary-card";
import type { AssignmentOverview } from "./types";

export function ClassInsightsCard({ overview }: { overview: AssignmentOverview }) {
  const { insights, stats, assignment, narrative } = overview;
  return (
    <section className="flex flex-col gap-4 rounded-[20px] border-[1.5px] border-pace-line bg-white p-5 shadow-[0_3px_0_0_var(--color-pace-line)]">
      <h2 className="flex items-center gap-2 text-[15px] font-bold text-pace-ink">
        <BarChart3 className="size-4" />
        Class insights
      </h2>
      <ScoreDistribution bands={insights.bands} total={stats.submitted} />
      <HeartsScoreTiles buckets={insights.byHearts} />
      {insights.mostFailed && (
        <p className="flex items-start gap-2 rounded-xl bg-pace-red-tint px-3.5 py-3 text-xs text-pace-red">
          <CircleAlert className="mt-px size-3.5 shrink-0" />
          Most failed: {insights.mostFailed.label}, {insights.mostFailed.count}{" "}
          {insights.mostFailed.count === 1 ? "student" : "students"}
        </p>
      )}
      <AiSummaryCard assignmentId={assignment.id} initialNarrative={narrative} hasSubmissions={stats.submitted > 0} />
    </section>
  );
}
