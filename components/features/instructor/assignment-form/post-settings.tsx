import { PostClasses } from "./post-classes";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LANGUAGES, type AssignmentFormValues } from "@/lib/assignment-form";
import type { InstructorClassSummary } from "@/components/features/instructor/types";
import { FormField, formControl } from "./form-field";

type Props = {
  values: AssignmentFormValues;
  classes: InstructorClassSummary[];
  locked: boolean;
  totalPoints?: number;
  showPostTitle?: boolean;
  onChange: (patch: Partial<AssignmentFormValues>) => void;
};

export function PostSettings({
  values,
  totalPoints,
  classes,
  locked,
  onChange,
  showPostTitle = false,
}: Props) {
  return (
    <div className="flex flex-col gap-4">
      {showPostTitle && (
        <FormField label="Post title" htmlFor="post-settings-title">
          <Input
            id="post-settings-title"
            value={values.title}
            onChange={(event) => onChange({ title: event.target.value })}
            className={formControl}
          />
        </FormField>
      )}
      <PostClasses classes={classes} selected={values.classIds} locked={locked} onChange={(classIds) => onChange({ classIds })} />
      <FormField label="Assign to" htmlFor="post-students">
        <Input
          id="post-students"
          readOnly
          value="All students"
          className={formControl}
        />
      </FormField>
      <FormField label="Points" htmlFor="post-points">
        <Input
          id="post-points"
          type="number"
          min={0}
          readOnly={totalPoints !== undefined}
          value={totalPoints ?? values.points ?? 100}
          onChange={(event) => onChange({ points: event.target.valueAsNumber })}
          className={formControl}
        />
      </FormField>
      <FormField label="Due" htmlFor="post-due">
        <Input
          id="post-due"
          type="datetime-local"
          value={values.dueDate}
          onChange={(event) => onChange({ dueDate: event.target.value })}
          className={formControl}
        />
      </FormField>
      <FormField label="Label" htmlFor="post-label">
        <Select
          value={values.label ?? "Activity"}
          onValueChange={(value) => {
            if (value)
              onChange({ label: value as AssignmentFormValues["label"] });
          }}
        >
          <SelectTrigger id="post-label" className={formControl}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {["Assignment", "Activity", "Quiz"].map((label) => (
              <SelectItem key={label} value={label}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </FormField>
      <FormField label="Language" htmlFor="post-language">
        <Select
          value={values.language}
          disabled={locked}
          onValueChange={(value) => {
            if (value) onChange({ language: value });
          }}
        >
          <SelectTrigger id="post-language" className={formControl}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {LANGUAGES.map((language) => (
              <SelectItem key={language} value={language}>
                {language}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </FormField>
      <hr className="border-pace-line" />
      <h2 className="text-base font-bold">AI tutor and monitoring</h2>
      <FormField label="Hearts per student" htmlFor="post-hearts">
        <Input
          id="post-hearts"
          type="number"
          min={1}
          step={1}
          value={values.heartsCount}
          onChange={(event) =>
            onChange({ heartsCount: event.target.valueAsNumber })
          }
          className={formControl}
        />
      </FormField>
      <FormField
        label="One heart refills every (minutes)"
        htmlFor="post-refill"
      >
        <Input
          id="post-refill"
          type="number"
          min={1}
          step={1}
          value={values.heartsRegenMinutes}
          onChange={(event) =>
            onChange({ heartsRegenMinutes: event.target.valueAsNumber })
          }
          className={formControl}
        />
      </FormField>
    </div>
  );
}
