import { cn } from "@/lib/utils";
import { CONSTRUCTS, type ConstructId } from "@/lib/study/questionnaire";
import { LikertScale } from "./likert-scale";

const headerTones: Record<ConstructId, string> = {
  PU: "bg-pace-green-tint",
  PEOU: "bg-pace-blue-tint",
  ATU: "bg-pace-purple-tint",
  BI: "bg-pace-peach",
};

type ConstructBlockProps = {
  construct: (typeof CONSTRUCTS)[number];
  values: (number | null)[];
  onAnswer: (itemIndex: number, rating: number) => void;
};

export function ConstructBlock({ construct, values, onAnswer }: ConstructBlockProps) {
  const answered = values.filter((v) => v !== null).length;
  return (
    <div className="overflow-hidden rounded-2xl border-[1.5px] border-pace-line">
      <div className={cn("flex items-center justify-between px-[18px] py-3.5", headerTones[construct.id])}>
        <p className="flex items-baseline gap-2.5 text-pace-ink">
          <span className="text-lg font-bold">{construct.id}</span>
          <span className="pace-body font-semibold">{construct.name}</span>
        </p>
        <span className="pace-small text-pace-ink-2">
          {answered} of {construct.items.length}
        </span>
      </div>
      {construct.items.map((text, index) => (
        <div
          key={text}
          className="flex flex-col gap-3 border-t border-pace-line px-[18px] py-4 lg:flex-row lg:items-center lg:gap-5"
        >
          <span className="pace-small w-12 shrink-0 font-semibold text-pace-muted">
            {construct.id}
            {index + 1}
          </span>
          <p className="pace-body flex-1 text-pace-ink">{text}</p>
          <LikertScale
            name={`${construct.id}${index + 1}: ${text}`}
            value={values[index] ?? 0}
            onChange={(rating) => onAnswer(index, rating)}
          />
        </div>
      ))}
    </div>
  );
}
