import { Checkbox } from "@/components/ui/checkbox";
import type { InstructorClassSummary } from "@/components/features/instructor/types";

export function PostClasses({ classes, selected, locked, onChange }: {
  classes: InstructorClassSummary[];
  selected: string[];
  locked: boolean;
  onChange: (classIds: string[]) => void;
}) {
  return (
    <fieldset className="flex flex-col gap-2">
      <legend className="mb-2 text-[13px] font-semibold">For</legend>
      {classes.map((cls) => (
        <label key={cls.id} className="flex items-center gap-2 rounded-xl border border-pace-line-strong p-3 text-[13px]">
          <Checkbox
            checked={selected.includes(cls.id)}
            disabled={locked && selected.includes(cls.id)}
            onCheckedChange={(checked) => onChange(checked ? [...selected, cls.id] : selected.filter((id) => id !== cls.id))}
          />
          {cls.name}
        </label>
      ))}
    </fieldset>
  );
}
