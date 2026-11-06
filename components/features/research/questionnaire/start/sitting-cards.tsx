"use client";

import { Radio } from "@base-ui/react/radio";
import { RadioGroup } from "@base-ui/react/radio-group";
import type { Sitting } from "@/lib/study/sitting-form";

const sittings: { id: Sitting; title: string; copy: string }[] = [
  {
    id: 1,
    title: "Sitting 1 · Before your PACE sessions",
    copy: "About you, then the problems and acceptability of your current workflow (the LMS, IDE, and AI tools you use now). About 10 to 15 minutes.",
  },
  {
    id: 2,
    title: "Sitting 2 · After your PACE sessions",
    copy: "The same statements for PACE, five statements about PACE's features, and three optional comments. About 10 to 15 minutes.",
  },
];

type Props = { value: Sitting; submitted: Sitting[]; onChange: (sitting: Sitting) => void };

export function SittingCards({ value, submitted, onChange }: Props) {
  return (
    <div className="flex flex-col gap-3">
      <p id="sitting-label" className="text-[15px] font-semibold text-lp-ink">Which sitting are you answering?</p>
      <RadioGroup
        aria-labelledby="sitting-label"
        value={String(value)}
        onValueChange={(next) => onChange(Number(next) as Sitting)}
        className="flex flex-col gap-3"
      >
        {sittings.map(({ id, title, copy }) => {
          const locked = submitted.includes(id);
          return (
            <Radio.Root
              key={id}
              value={String(id)}
              disabled={locked}
              className="flex w-full cursor-pointer flex-col items-start gap-1.5 rounded-[18px] border border-lp-line bg-white p-[22px] text-left transition-colors disabled:cursor-not-allowed disabled:opacity-60 data-[checked]:border-2 data-[checked]:border-[#111] data-[checked]:p-[21px]"
            >
              <span className="text-[17px] font-semibold text-lp-ink">{title}</span>
              <span className="text-[15px] leading-[23px] text-lp-muted">
                {locked ? "Submitted. This Sitting can no longer be changed." : copy}
              </span>
            </Radio.Root>
          );
        })}
      </RadioGroup>
    </div>
  );
}
