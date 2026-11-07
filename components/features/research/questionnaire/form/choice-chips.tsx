"use client";

import { Radio } from "@base-ui/react/radio";
import { RadioGroup } from "@base-ui/react/radio-group";

type Props = { label: string; options: string[]; value: string | undefined; onChange: (value: string) => void };

export function ChoiceChips({ label, options, value, onChange }: Props) {
  return (
    <div className="flex flex-col gap-3 rounded-[18px] border border-lp-line bg-white p-5">
      <p id={`q-${label}`} className="text-base font-medium leading-6 text-lp-ink">{label}</p>
      <RadioGroup
        aria-labelledby={`q-${label}`}
        value={value ?? ""}
        onValueChange={(next) => onChange(next as string)}
        className="flex flex-row flex-wrap gap-2"
      >
        {options.map((option) => (
          <Radio.Root
            key={option}
            value={option}
            className="cursor-pointer rounded-full border border-[#e3e1dd] bg-white px-4 py-[9px] text-sm font-medium text-[#3d3d3d] transition-colors data-[checked]:border-[#111] data-[checked]:bg-[#111] data-[checked]:text-white"
          >
            {option}
          </Radio.Root>
        ))}
      </RadioGroup>
    </div>
  );
}
