import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { AssignmentFormValues } from "@/lib/assignment-form";
import { FormField, formCard, formControl } from "./form-field";

type Props = {
  values: AssignmentFormValues;
  onChange: (patch: Partial<AssignmentFormValues>) => void;
};

export function DetailsSection({ values, onChange }: Props) {
  return (
    <section className={formCard}>
      <h2 className="text-base font-bold">Item 1 · Details</h2>
      <FormField label="Title" htmlFor="post-title">
        <Input
          id="post-title"
          value={values.itemTitle ?? values.title}
          onChange={(event) =>
            onChange({
              itemTitle: event.target.value,
              ...(!values.title || values.title === values.itemTitle
                ? { title: event.target.value }
                : {}),
            })
          }
          placeholder="Sum of Two Numbers"
          className={formControl}
        />
      </FormField>
      <FormField label="Instructions" htmlFor="post-instructions">
        <Textarea
          id="post-instructions"
          value={values.itemInstructions ?? values.instructions}
          onChange={(event) =>
            onChange({
              instructions: event.target.value,
              itemInstructions: event.target.value,
            })
          }
          placeholder="Write a program that reads two integers, one per line, and prints their sum."
          className={`${formControl} min-h-12 resize-y py-3`}
        />
      </FormField>
    </section>
  );
}
