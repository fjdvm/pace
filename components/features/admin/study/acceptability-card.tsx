import { formatMean, formatSd, hasData } from "./format";
import { StudyCard } from "./study-card";
import { PositionTrack } from "./position-track";
import { InterpretationTag } from "./interpretation-tag";
import type { StudyResults } from "@/lib/study/analysis";

const grid = "grid min-w-[640px] grid-cols-[1.5fr_0.8fr_0.8fr_1.6fr_1.6fr] items-center gap-4";
const heading = "text-[11px] font-bold uppercase tracking-[0.06em] text-pace-muted";

function Legend() {
  return (
    <div className="flex items-center gap-4 text-xs text-pace-ink-2">
      <span className="flex items-center gap-1.5">
        <span className="size-2 rounded-full bg-pace-green" /> Students
      </span>
      <span className="flex items-center gap-1.5">
        <span className="size-2 rounded-full bg-pace-purple" /> Instructors
      </span>
    </div>
  );
}

export function AcceptabilityCard({ constructs }: { constructs: StudyResults["constructs"] }) {
  return (
    <StudyCard
      title="Acceptability by construct"
      subtitle="Weighted mean (SD) on a 1–5 scale · SOP 2"
      aside={<Legend />}
    >
      <div className="overflow-x-auto">
        <div className={`${grid} rounded-lg bg-pace-canvas px-3 py-2`}>
          <span className={heading}>Construct</span>
          <span className={heading}>Students</span>
          <span className={heading}>Instructors</span>
          <span className={heading}>Position on 1–5</span>
          <span className={heading}>Interpretation</span>
        </div>
        {constructs.map((c) => (
          <div key={c.id} className={`${grid} border-t border-pace-line px-3 py-3.5 first:border-t-0`}>
            <span className="flex flex-col">
              <span className="text-sm font-bold text-pace-ink">{c.id}</span>
              <span className="text-xs text-pace-muted">{c.name}</span>
            </span>
            <span className="text-sm font-bold text-pace-ink">
              {formatMean(c.student)} <span className="font-normal text-pace-muted">{formatSd(c.student)}</span>
            </span>
            <span className="text-sm font-bold text-pace-ink">
              {formatMean(c.instructor)}{" "}
              <span className="font-normal text-pace-muted">{formatSd(c.instructor)}</span>
            </span>
            {hasData(c.student) && hasData(c.instructor) ? (
              <PositionTrack student={c.student.mean} instructor={c.instructor.mean} />
            ) : (
              <span className="text-xs text-pace-muted">Needs both groups</span>
            )}
            <span className="flex flex-col items-start gap-1.5">
              {hasData(c.student) && <InterpretationTag group="S" label={c.student.label} />}
              {hasData(c.instructor) && <InterpretationTag group="I" label={c.instructor.label} />}
            </span>
          </div>
        ))}
      </div>
      <p className="flex items-center gap-2 text-xs text-pace-muted">
        <span className="h-2.5 w-5 rounded-sm bg-pace-green-tint" />
        Shaded band = Highly acceptable (4.20–5.00)
      </p>
    </StudyCard>
  );
}
