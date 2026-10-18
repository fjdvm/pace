import { Scale, ShieldCheck, Users, GraduationCap } from "lucide-react";
import { cn } from "@/lib/utils";
import { ProgressBar } from "@/components/features/student/shared/progress-bar";
import { MARGIN_OF_ERROR, POPULATION, SCALE_CUTOFF } from "@/lib/study/questionnaire";
import type { StudyResults } from "@/lib/study/analysis";

type CardProps = {
  Icon: typeof Users;
  tone: string;
  label: string;
  value: string;
  note: string;
  percent?: number;
  barTone?: "green" | "purple";
};

function SummaryCard({ Icon, tone, label, value, note, percent, barTone }: CardProps) {
  return (
    <div className="flex flex-col gap-2 rounded-[20px] border-[1.5px] border-pace-line bg-white p-5 shadow-[0_3px_0_0_var(--color-pace-line)]">
      <span className="flex items-center gap-2 text-[13px] text-pace-ink-2">
        <span className={cn("flex size-7 items-center justify-center rounded-lg", tone)}>
          <Icon className="size-3.5" strokeWidth={1.75} />
        </span>
        {label}
      </span>
      <span className="text-[34px] font-bold leading-tight tracking-[-0.01em] text-pace-ink">{value}</span>
      <span className="text-xs leading-relaxed text-pace-ink-2">{note}</span>
      {percent !== undefined && <ProgressBar value={percent} tone={barTone} className="mt-auto h-1.5" />}
    </div>
  );
}

export function SummaryCards({ results }: { results: StudyResults }) {
  const { responses, overall, reliability } = results;
  const percent = (count: number, target: number) => (target ? (count / target) * 100 : 0);
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <SummaryCard
        Icon={GraduationCap}
        tone="bg-pace-green-tint text-pace-green-deep"
        label="Student responses"
        value={`${responses.student.count} / ${responses.student.target}`}
        note={`Target from Slovin's formula (N = ${POPULATION}, e = ${MARGIN_OF_ERROR})`}
        percent={percent(responses.student.count, responses.student.target)}
        barTone="green"
      />
      <SummaryCard
        Icon={Users}
        tone="bg-pace-purple-tint text-pace-purple"
        label="Instructor responses"
        value={`${responses.instructor.count} / ${responses.instructor.target}`}
        note="All eligible instructors are invited (purposive)"
        percent={percent(responses.instructor.count, responses.instructor.target)}
        barTone="purple"
      />
      <SummaryCard
        Icon={Scale}
        tone="bg-pace-blue-tint text-pace-blue"
        label="Overall weighted mean"
        value={`${overall.student.toFixed(2)} · ${overall.instructor.toFixed(2)}`}
        note={`Students · Instructors. ${overall.label === "Mixed" ? "Groups fall in different bands." : `Both "${overall.label}"`}`}
      />
      <SummaryCard
        Icon={ShieldCheck}
        tone="bg-pace-amber-tint text-pace-amber"
        label={`Reliability (${reliability.basis})`}
        value={`α ≥ ${reliability.minAlpha.toFixed(2)}`}
        note={
          reliability.passes
            ? `All four constructs pass the ${SCALE_CUTOFF.toFixed(2)} cutoff`
            : `Some constructs fall below the ${SCALE_CUTOFF.toFixed(2)} cutoff`
        }
      />
    </div>
  );
}
