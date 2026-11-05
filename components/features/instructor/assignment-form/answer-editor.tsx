import { ChoiceEditor } from "./choice-editor";
import { ShortAnswerEditor } from "./short-answer-editor";
import type { MultipleChoiceInput } from "@/lib/items/multiple-choice";
import type { ShortAnswerInput } from "@/lib/items/short-answer";
export type AnswerInput = MultipleChoiceInput | ShortAnswerInput;
export function AnswerEditor(props: {
  initial: AnswerInput; locked: boolean; busy: boolean;
  onSave: (value: AnswerInput) => void; onDelete: () => void;
  onPreviewChange: (value: AnswerInput) => void;
}) {
  return props.initial.kind === "short_answer"
    ? <ShortAnswerEditor {...props} initial={props.initial} />
    : <ChoiceEditor {...props} initial={props.initial} />;
}
