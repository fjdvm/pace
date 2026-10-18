import { CONSTRUCTS } from "@/lib/study/questionnaire";
import type { StudyResults } from "@/lib/study/analysis";
import { InterpretationTag } from "./interpretation-tag";
import { StudyCard } from "./study-card";

const grid = "grid min-w-[640px] grid-cols-[2.4fr_1fr_1fr_2fr] items-center gap-4";

export function ItemsTab({ items }: { items: StudyResults["items"] }) {
  return (
    <div className="flex flex-col gap-5">
      {CONSTRUCTS.map((construct) => (
        <StudyCard key={construct.id} title={`${construct.id} · ${construct.name}`} subtitle="Mean (SD) per questionnaire item">
          <div className="overflow-x-auto">
            {items
              .filter((item) => item.constructId === construct.id)
              .map((item) => (
                <div key={item.text} className={`${grid} border-t border-pace-line px-3 py-3 first:border-t-0`}>
                  <span className="text-sm text-pace-ink">{item.text}</span>
                  <span className="text-sm font-bold text-pace-ink">
                    {item.student.mean.toFixed(2)} <span className="font-normal text-pace-muted">({item.student.sd.toFixed(2)})</span>
                  </span>
                  <span className="text-sm font-bold text-pace-ink">
                    {item.instructor.mean.toFixed(2)}{" "}
                    <span className="font-normal text-pace-muted">({item.instructor.sd.toFixed(2)})</span>
                  </span>
                  <span className="flex flex-col items-start gap-1.5">
                    <InterpretationTag group="S" label={item.student.label} />
                    <InterpretationTag group="I" label={item.instructor.label} />
                  </span>
                </div>
              ))}
          </div>
        </StudyCard>
      ))}
    </div>
  );
}
