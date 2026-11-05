"use client";

import Image from "next/image";
import { useId } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

type Props = {
  options: string[];
  value: string;
  disabled?: boolean;
  onChange?: (value: string) => void;
};
export function ChoiceOptions({ options, value, disabled, onChange }: Props) {
  const id = useId();
  return (
    <RadioGroup
      aria-label="Choose one answer"
      value={value}
      disabled={disabled}
      onValueChange={(value) => onChange?.(String(value))}
      className="gap-2.5 lg:gap-3"
    >
      {options.map((option, index) => (
        <label
          key={index}
          htmlFor={`${id}-${index}`}
          className={`flex cursor-pointer items-center gap-3 rounded-[10px] border p-4 text-[15px] leading-[1.55] ${value === String(index) ? "border-2 border-pace-green bg-pace-green-tint font-bold" : "border-pace-line"}`}
        >
          <span className="relative flex size-[22px] shrink-0">
            <RadioGroupItem
              id={`${id}-${index}`}
              value={String(index)}
              className={`size-[22px] ${value === String(index) ? "opacity-0" : ""} border-2 border-pace-line-strong data-checked:border-pace-green data-checked:bg-pace-green`}
            />
            {value === String(index) && (
              <Image
                src="/choice/selected.svg"
                alt=""
                width={22}
                height={22}
                className="pointer-events-none absolute inset-0"
              />
            )}
          </span>
          <span className="min-w-0 break-words">{option}</span>
        </label>
      ))}
    </RadioGroup>
  );
}
