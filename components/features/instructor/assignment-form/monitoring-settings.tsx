import { Switch } from "@/components/ui/switch";
import type { AssignmentFormValues } from "@/lib/assignment-form";

const settings = [
  ["aiTutorEnabled", "AI tutor", "Students can ask for hints inside the editor"],
  ["tieredHintsEnabled", "Tiered hints", "Hints get more specific with each heart spent"],
  ["monitoringEnabled", "Activity monitoring", "Record typing, pasting, and tab switches"],
  ["similarityCheckEnabled", "Code similarity check", "Flag submissions with very similar structure"],
] as const;

export function MonitoringSettings({ mobile = false, values, onChange }: {
  mobile?: boolean;
  values: AssignmentFormValues;
  onChange: (patch: Partial<AssignmentFormValues>) => void;
}) {
  return (
    <div className={mobile ? "flex flex-col gap-5" : "flex flex-col gap-4"}>
      {settings.filter(([key]) => !mobile || key !== "tieredHintsEnabled").map(([key, title, subtitle]) => (
        <div key={key} className="flex items-center justify-between gap-3">
          <div>
            <p className={mobile ? "text-[15px]" : "text-[15px] font-bold"}>{title}</p>
            {!mobile && <p className="mt-0.5 text-[13px] leading-normal text-pace-muted">{subtitle}</p>}
          </div>
          <Switch
            aria-label={title}
            checked={values[key] ?? true}
            onCheckedChange={(checked) => onChange({ [key]: checked })}
            className="data-[size=default]:h-6 data-[size=default]:w-10 shrink-0 [&_[data-slot=switch-thumb]]:size-5 [&_[data-slot=switch-thumb]]:bg-white data-checked:bg-pace-green"
          />
        </div>
      ))}
      {!mobile && <p className="text-[13px] leading-normal text-pace-muted">Students are told before they start that their activity is recorded.</p>}
    </div>
  );
}
