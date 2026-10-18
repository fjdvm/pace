import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { splitClassName } from "@/lib/class-name";
import type { InstructorClassSummary } from "@/components/features/instructor/types";
import { FormSection } from "./form-section";

type ClassesSectionProps = {
  classes: InstructorClassSummary[];
  selected: string[];
  onToggle: (classId: string) => void;
};

export function ClassesSection({ classes, selected, onToggle }: ClassesSectionProps) {
  return (
    <FormSection step={4} title="Assign to classes">
      {classes.length === 0 ? (
        <p className="text-sm text-pace-red">Create a class from the sidebar before publishing an assignment.</p>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {classes.map((cls) => {
            const checked = selected.includes(cls.id);
            const { code, description } = splitClassName(cls.name);
            return (
              <button
                key={cls.id}
                type="button"
                role="checkbox"
                aria-checked={checked}
                onClick={() => onToggle(cls.id)}
                className={cn(
                  "flex cursor-pointer items-center gap-3 rounded-xl border-[1.5px] px-4 py-3 text-left",
                  checked ? "border-pace-green bg-pace-green-tint" : "border-pace-line bg-white",
                )}
              >
                <span
                  className={cn(
                    "flex size-5 shrink-0 items-center justify-center rounded-md border-[1.5px]",
                    checked ? "border-pace-green bg-pace-green text-white" : "border-pace-line-strong",
                  )}
                >
                  {checked && <Check className="size-3.5" strokeWidth={3} />}
                </span>
                <span className="flex min-w-0 flex-col">
                  <span className="truncate text-sm font-bold text-pace-ink">{code}</span>
                  <span className="truncate text-xs text-pace-ink-2">
                    {description ? `${description} · ` : ""}
                    {cls.studentCount} students
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      )}
    </FormSection>
  );
}
