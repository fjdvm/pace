import { Check } from "lucide-react";
import type { StepState } from "@/lib/study/form-progress";
import { cn } from "@/lib/utils";

type Props = { steps: { label: string; state: StepState }[] };

export function StepPills({ steps }: Props) {
  return (
    <ol className="flex flex-wrap items-center gap-2">
      {steps.map((step, index) => (
        <li
          key={step.label}
          data-state={step.state}
          className={cn(
            "flex items-center gap-2 rounded-full border px-3.5 py-2 transition-colors duration-300",
            step.state === "current" ? "border-[#111] bg-[#111] text-white" : "border-[#e3e1dd] bg-white",
          )}
        >
          <span className={cn("text-[13px] font-bold", step.state === "current" ? "text-white" : "text-[#8a8a8a]")}>
            {step.state === "done" ? <Check className="size-3.5 text-[#2bc84e]" strokeWidth={3} /> : index + 1}
          </span>
          <span className={cn("text-sm font-medium", step.state === "current" ? "text-white" : "text-lp-muted")}>
            {step.label}
          </span>
        </li>
      ))}
    </ol>
  );
}
