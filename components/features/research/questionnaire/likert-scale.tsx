import { cn } from "@/lib/utils";
import { LIKERT_LABELS } from "@/lib/study/questionnaire";

type LikertScaleProps = {
  name: string;
  value: number;
  onChange: (value: number) => void;
};

export function LikertScale({ name, value, onChange }: LikertScaleProps) {
  return (
    <div role="radiogroup" aria-label={name} className="flex shrink-0 gap-1.5">
      {LIKERT_LABELS.map((label, index) => {
        const rating = index + 1;
        const selected = value === rating;
        return (
          <button
            key={rating}
            type="button"
            role="radio"
            aria-checked={selected}
            aria-label={`${rating} ${label}`}
            onClick={() => onChange(rating)}
            className={cn(
              "flex size-10 cursor-pointer items-center justify-center rounded-[10px] border-[1.5px] text-sm font-semibold",
              selected ? "border-pace-ink bg-pace-ink text-white" : "border-pace-line bg-white text-pace-ink hover:border-pace-line-strong",
            )}
          >
            {rating}
          </button>
        );
      })}
    </div>
  );
}
