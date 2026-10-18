import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import type { StepState } from "@/lib/study/form-progress";


type ProgressCardProps = {
  steps: { label: string; state: StepState }[];
  answered: number;
  total: number;
};

export function ProgressCard({ steps, answered, total }: ProgressCardProps) {
  return (
    <div className="flex flex-col gap-3.5 rounded-2xl border-[1.5px] border-pace-line bg-white px-6 py-[18px]">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <ol className="flex flex-wrap items-center gap-x-5 gap-y-2">
          {steps.map((step, index) => (
            <li key={step.label} className="flex items-center gap-2 text-sm font-semibold text-pace-ink">
              <span
                className={cn(
                  "flex size-6 items-center justify-center rounded-full text-xs",
                  step.state === "done" && "bg-pace-green text-white",
                  step.state === "current" && "bg-pace-ink text-white",
                  step.state === "todo" && "bg-pace-sunken text-pace-ink-2",
                )}
              >
                {step.state === "done" ? <Check className="size-3.5" strokeWidth={3} /> : index + 1}
              </span>
              <span className={step.state === "todo" ? "text-pace-ink-2" : undefined}>{step.label}</span>
            </li>
          ))}
        </ol>
        <p className="text-sm text-pace-ink-2">
          {answered} of {total} statements answered
        </p>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-pace-sunken" role="progressbar" aria-valuenow={answered} aria-valuemax={total}>
        <div className="h-full rounded-full bg-pace-green transition-[width]" style={{ width: `${(answered / total) * 100}%` }} />
      </div>
    </div>
  );
}
