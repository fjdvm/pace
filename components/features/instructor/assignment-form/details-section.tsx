import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { AssignmentFormValues } from "@/lib/assignment-form";
import { FormField, formCard, formControl } from "./form-field";

type Props = {
  values: AssignmentFormValues;
  itemNumber?: number;
  onTitleChange: (title: string) => void;
  onInstructionsChange: (instructions: string) => void;
};

export function DetailsSection({
  values,
  itemNumber = 1,
  onTitleChange,
  onInstructionsChange,
}: Props) {
  return (
    <section className={formCard}>
      <h2 className="text-base font-bold">Item {itemNumber} · Details</h2>
      <FormField label="Title" htmlFor="post-title">
        <Input
          id="post-title"
          value={values.itemTitle ?? values.title}
          onChange={(event) => onTitleChange(event.target.value)}
          placeholder="Sum of Two Numbers"
          className={formControl}
        />
      </FormField>
      <FormField label="Instructions" htmlFor="post-instructions">
        <Textarea
          id="post-instructions"
          value={values.itemInstructions ?? values.instructions}
          onChange={(event) => onInstructionsChange(event.target.value)}
          placeholder="Write a program that reads two integers, one per line, and prints their sum."
          className={`${formControl} h-auto min-h-12 resize-y py-3`}
        />
      </FormField>
    </section>
  );
}
