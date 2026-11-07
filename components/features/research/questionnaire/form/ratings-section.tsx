import type { FormState } from "@/lib/study/form-progress";
import type { RatingsSection as RatingsSectionData } from "@/lib/study/sitting-form";
import { FadeUp } from "../shared/fade-up";
import { PartHeader } from "./part-header";
import { RatingItem } from "./rating-item";

type Props = { section: RatingsSectionData; state: FormState; onAnswer: (code: string, value: number) => void };

export function RatingsSection({ section, state, onAnswer }: Props) {
  return (
    <>
      <FadeUp>
        <PartHeader part={section.part} title={section.title} subtitle={section.subtitle} scale={section.scale} />
      </FadeUp>
      {section.groups.map((group, index) => (
        <div key={group.label || index} className="flex flex-col gap-3.5">
          {group.label && <p className="text-xs font-bold tracking-[0.06em] text-[#8a8a8a]">{group.label}</p>}
          {group.items.map((item) => (
            <RatingItem
              key={item.code}
              item={item}
              scale={section.scale}
              setup={section.setup}
              value={state.answers[item.code]}
              onChange={(value) => onAnswer(item.code, value)}
            />
          ))}
        </div>
      ))}
    </>
  );
}
