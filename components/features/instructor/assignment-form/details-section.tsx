import { LANGUAGES, type AssignmentFormValues } from "@/lib/assignment-form";
import { FormSection } from "./form-section";
import { FieldLabel } from "./field-label";

type DetailsSectionProps = {
  values: AssignmentFormValues;
  onChange: (patch: Partial<AssignmentFormValues>) => void;
};

const control =
  "w-full rounded-xl border-[1.5px] border-pace-line bg-white px-3.5 text-sm text-pace-ink outline-none placeholder:text-pace-muted focus:border-pace-ink";

export function DetailsSection({ values, onChange }: DetailsSectionProps) {
  return (
    <FormSection step={1} title="Details" subtitle="What students will see at the top of the workspace">
      <div className="flex flex-col gap-1.5">
        <FieldLabel htmlFor="assignment-title">Title</FieldLabel>
        <input
          id="assignment-title"
          value={values.title}
          onChange={(e) => onChange({ title: e.target.value })}
          placeholder="Sum of Two Numbers"
          className={`${control} h-11`}
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <FieldLabel htmlFor="assignment-language">Language</FieldLabel>
          <select
            id="assignment-language"
            value={values.language}
            onChange={(e) => onChange({ language: e.target.value })}
            className={`${control} h-11`}
          >
            {LANGUAGES.map((language) => (
              <option key={language} value={language}>
                {language}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-1.5">
          <FieldLabel htmlFor="assignment-due">Due date</FieldLabel>
          <input
            id="assignment-due"
            type="datetime-local"
            value={values.dueDate}
            onChange={(e) => onChange({ dueDate: e.target.value })}
            className={`${control} h-11`}
          />
        </div>
      </div>
      <div className="flex flex-col gap-1.5">
        <FieldLabel htmlFor="assignment-instructions">Instructions</FieldLabel>
        <textarea
          id="assignment-instructions"
          value={values.instructions}
          onChange={(e) => onChange({ instructions: e.target.value })}
          placeholder="Describe the problem and include an example."
          rows={5}
          className={`${control} resize-y py-3`}
        />
      </div>
    </FormSection>
  );
}
