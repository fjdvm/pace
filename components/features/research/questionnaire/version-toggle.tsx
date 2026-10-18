import { GraduationCap, User } from "lucide-react";
import { cn } from "@/lib/utils";
import type { QuestionnaireVersion } from "@/lib/study/questionnaire";

const options: { id: QuestionnaireVersion; label: string; Icon: typeof User }[] = [
  { id: "student", label: "I’m a student", Icon: GraduationCap },
  { id: "instructor", label: "I’m an instructor", Icon: User },
];

type VersionToggleProps = {
  value: QuestionnaireVersion;
  onChange: (version: QuestionnaireVersion) => void;
};

export function VersionToggle({ value, onChange }: VersionToggleProps) {
  return (
    <div role="radiogroup" aria-label="Questionnaire version" className="flex w-fit gap-1 rounded-full border-[1.5px] border-pace-line bg-white p-1">
      {options.map(({ id, label, Icon }) => (
        <button
          key={id}
          type="button"
          role="radio"
          aria-checked={value === id}
          onClick={() => onChange(id)}
          className={cn(
            "pace-body flex cursor-pointer items-center gap-2 rounded-full px-[18px] py-2.5 font-semibold",
            value === id ? "bg-pace-ink text-white" : "text-pace-ink-2",
          )}
        >
          <Icon className="size-4" />
          {label}
        </button>
      ))}
    </div>
  );
}
