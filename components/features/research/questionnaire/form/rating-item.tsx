"use client";

import { Radio } from "@base-ui/react/radio";
import { RadioGroup } from "@base-ui/react/radio-group";
import type { Item, Setup } from "@/lib/study/items/types";
import { scaleLabels, type Scale } from "@/lib/study/sitting-form";
import { FadeUp } from "../shared/fade-up";

type Props = {
  item: Item;
  scale: Scale;
  setup: Setup;
  value: number | undefined;
  onChange: (value: number) => void;
};

export function RatingItem({ item, scale, setup, value, onChange }: Props) {
  const options = scaleLabels(scale)
    .map((label, index) => ({ label, rating: index + 1 }))
    .reverse();

  return (
    <FadeUp className="flex flex-col gap-3.5 rounded-[18px] border border-lp-line bg-white p-5">
      <div className="flex items-start gap-3">
        <span className="rounded-md bg-lp-canvas px-2 py-[3px] text-xs font-bold text-lp-muted">{item.code}</span>
        <p id={`item-${item.code}`} className="min-w-0 flex-1 text-base leading-6 text-lp-ink">{item.text}</p>
      </div>
      <p className="text-xs font-medium text-lp-teal">{setup === "current" ? "Current workflow" : "PACE"}</p>
      <RadioGroup
        aria-labelledby={`item-${item.code}`}
        value={value === undefined ? "" : String(value)}
        onValueChange={(next) => onChange(Number(next))}
        className="flex flex-row flex-wrap gap-2"
      >
        {options.map(({ label, rating }) => (
          <Radio.Root
            key={rating}
            value={String(rating)}
            className="flex min-w-fit flex-none cursor-pointer sm:flex-1 items-start justify-center rounded-xl border border-[#e3e1dd] bg-white px-3 py-[11px] text-[13px] font-medium text-[#3d3d3d] shadow-[0_3px_0_0_#e0ded9] transition-[transform,box-shadow,background-color] data-[checked]:translate-y-[3px] data-[checked]:border-[#111] data-[checked]:bg-[#111] data-[checked]:text-white data-[checked]:shadow-[0_0_0_0_#e0ded9]"
          >
            {label}
          </Radio.Root>
        ))}
      </RadioGroup>
    </FadeUp>
  );
}
