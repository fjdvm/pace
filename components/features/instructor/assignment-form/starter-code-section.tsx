import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import type { AssignmentFormValues } from "@/lib/assignment-form";
import { formCard } from "./form-field";

type Props = {
  values: AssignmentFormValues;
  locked: boolean;
  onChange: (patch: Partial<AssignmentFormValues>) => void;
};
const filenames: Record<string, string> = {
  Python: "main.py · Python 3",
  JavaScript: "main.js · JavaScript",
  C: "main.c · C",
  "C#": "Program.cs · C#",
};

export function StarterCodeSection({ values, locked, onChange }: Props) {
  return (
    <section className={formCard}>
      <div className="flex items-center justify-between gap-3">
        <label htmlFor="starter-code" className="text-base font-bold">
          Starter code (optional)
        </label>
        <Badge className="rounded-full bg-pace-sunken px-2.5 py-1 text-xs text-pace-ink-2">
          {filenames[values.language]}
        </Badge>
      </div>
      <Textarea
        id="starter-code"
        aria-label="Starter code"
        disabled={locked}
        value={values.starterCode ?? ""}
        onChange={(event) => onChange({ starterCode: event.target.value })}
        placeholder="# Your code here"
        className="min-h-32 resize-y rounded-lg border-pace-line bg-pace-canvas p-3 font-mono text-[13px] leading-[1.65] shadow-none"
      />
      {locked && (
        <p className="text-xs text-pace-muted">
          Coding configuration is locked because a Student has started.
        </p>
      )}
    </section>
  );
}
