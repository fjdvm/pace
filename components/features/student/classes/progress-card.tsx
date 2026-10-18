import { ProgressBar } from "@/components/features/student/shared/progress-bar";
import type { StudentAssignment } from "@/components/features/student/types";

export function ProgressCard({ assignments }: { assignments: StudentAssignment[] }) {
  const submitted = assignments.filter((a) => a.status === "submitted");
  const average = submitted.length
    ? Math.round(submitted.reduce((sum, a) => sum + (a.score ?? 0), 0) / submitted.length)
    : null;

  return (
    <section className="flex flex-col gap-3 rounded-[20px] border-[1.5px] border-pace-line bg-white p-5">
      <h2 className="text-base font-bold leading-snug tracking-[-0.005em] text-pace-ink">Your progress</h2>
      <div className="flex items-start justify-between text-[13px] leading-normal">
        <span className="text-pace-ink-2">
          {submitted.length} of {assignments.length} submitted
        </span>
        {average !== null && <span className="font-semibold text-pace-ink">Avg {average}%</span>}
      </div>
      <ProgressBar value={assignments.length ? (submitted.length / assignments.length) * 100 : 0} />
    </section>
  );
}
