import { ChoiceOptions } from "@/components/features/student/workspace/choice-options";
import type { MultipleChoiceInput } from "@/lib/items/multiple-choice";
export function ChoicePreview({
  value,
  index,
  total,
}: {
  value: MultipleChoiceInput;
  index: number;
  total: number;
}) {
  return (
    <section className="h-fit space-y-2.5 rounded-[12px] border border-pace-line bg-white p-5">
      <h2 className="text-base font-bold">Student preview</h2>
      <p className="text-[11px] font-bold uppercase tracking-[.66px] text-pace-muted">
        Item {index + 1} of {total} · {value.points} pts
      </p>
      <p className="text-[15px] font-bold">
        {value.title || "New multiple choice item"}
      </p>
      <div className="[&_label]:gap-2.5 [&_label]:rounded-[8px] [&_label]:p-2.5 [&_label]:text-[13px] [&_[data-slot=radio-group-item]]:size-[18px]">
        <ChoiceOptions options={value.options} value="" disabled />
      </div>
    </section>
  );
}
