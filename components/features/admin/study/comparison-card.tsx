import { PaceTag } from "@/components/features/student/shared/pace-tag";
import type { StudyResults } from "@/lib/study/analysis";
import { StudyCard } from "./study-card";

const grid = "grid min-w-[560px] grid-cols-[1fr_1.5fr_1fr_0.8fr_1fr_2fr] items-center gap-4";
const heading = "text-[11px] font-bold uppercase tracking-[0.06em] text-pace-muted";

export function ComparisonCard({ rows }: { rows: StudyResults["comparison"] }) {
  return (
    <StudyCard
      title="Students vs instructors"
      subtitle="Mann-Whitney U test on each respondent's construct score · α = 0.05 · SOP 3"
    >
      <div className="overflow-x-auto">
        <div className={`${grid} rounded-lg bg-pace-canvas px-3 py-2`}>
          {["Construct", "Median (S / I)", "U", "P", "Effect r", "Result"].map((h) => (
            <span key={h} className={heading}>
              {h}
            </span>
          ))}
        </div>
        {rows.map((row) => (
          <div key={row.id} className={`${grid} border-t border-pace-line px-3 py-3.5 first:border-t-0`}>
            <span className="text-sm font-bold text-pace-ink">{row.id}</span>
            <span className="font-mono text-xs text-pace-ink">
              {row.studentMedian.toFixed(2)} / {row.instructorMedian.toFixed(2)}
            </span>
            <span className="font-mono text-xs text-pace-ink">{row.u.toFixed(1)}</span>
            <span className="font-mono text-xs text-pace-ink">{row.p.toFixed(2)}</span>
            <span className="font-mono text-xs text-pace-ink">{row.r.toFixed(2)}</span>
            <span>
              <PaceTag tone={row.p < 0.05 ? "amber" : "neutral"} className="px-2.5 py-0.5 text-[11px]">
                {row.result}
              </PaceTag>
            </span>
          </div>
        ))}
      </div>
      <p className="text-xs text-pace-muted">Effect size r = |z|/√N: 0.1 small, 0.3 medium, 0.5 large.</p>
    </StudyCard>
  );
}
