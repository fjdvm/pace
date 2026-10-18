import { Check, Info, X } from "lucide-react";
import { SCALE_CUTOFF } from "@/lib/study/questionnaire";
import type { StudyResults } from "@/lib/study/analysis";
import { StudyCard } from "./study-card";

type ReliabilityCardProps = {
  reliability: StudyResults["reliability"];
  closed: boolean;
};

export function ReliabilityCard({ reliability, closed }: ReliabilityCardProps) {
  return (
    <StudyCard title="Reliability" subtitle={`Cronbach's α per construct · cutoff ${SCALE_CUTOFF.toFixed(2)}`}>
      <div className="flex flex-col gap-3.5">
        {reliability.constructs.map(({ id, alpha }) => {
          const passes = alpha >= SCALE_CUTOFF;
          return (
            <div key={id} className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between text-sm">
                <span className="font-bold text-pace-ink">{id}</span>
                <span className="flex items-center gap-1.5 font-bold text-pace-ink">
                  {alpha.toFixed(2)}
                  {passes ? (
                    <Check className="size-3.5 text-pace-green-deep" strokeWidth={2.5} />
                  ) : (
                    <X className="size-3.5 text-pace-red" strokeWidth={2.5} />
                  )}
                </span>
              </div>
              <div className="relative h-2 rounded-full bg-pace-sunken">
                <span
                  className={`absolute inset-y-0 left-0 rounded-full ${passes ? "bg-pace-green" : "bg-pace-red"}`}
                  style={{ width: `${Math.max(0, Math.min(1, alpha)) * 100}%` }}
                />
                <span
                  className="absolute -inset-y-0.5 w-0.5 rounded bg-pace-ink"
                  style={{ left: `${SCALE_CUTOFF * 100}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
      <p className="flex gap-2 rounded-xl bg-pace-canvas px-3.5 py-3 text-xs leading-relaxed text-pace-ink-2">
        <Info className="mt-0.5 size-3.5 shrink-0" />
        {closed
          ? `Computed on the final data (${reliability.basis}).`
          : "From the pilot test. Recomputed on the final data once the questionnaire closes."}
      </p>
    </StudyCard>
  );
}
