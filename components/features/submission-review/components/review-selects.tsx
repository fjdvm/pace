"use client";
import Image from "next/image";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function ReviewSelect({
  label,
  value,
  options,
  onChange,
  mobile = false,
}: {
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
  mobile?: boolean;
}) {
  return (
    <Select
      value={value}
      items={options}
      onValueChange={(next) => {
        if (next !== null) onChange(next);
      }}
    >
      <SelectTrigger
        aria-label={label}
        className={
          mobile
            ? "h-auto! max-w-full min-w-0 gap-0 border-0 p-0 text-[11px] font-bold uppercase tracking-[0.66px] text-pace-muted shadow-none [&>svg]:hidden"
            : "h-[42px]! rounded-[8px] border-pace-line-strong bg-white py-2 pl-3.5 pr-2.5 text-[13px] font-bold [&>svg]:hidden"
        }
      >
        <SelectValue className="min-w-0 truncate" />
        {!mobile && (
          <Image
            src="/grading/chevron-down.svg"
            alt=""
            width={24}
            height={24}
          />
        )}
      </SelectTrigger>
      <SelectContent>
        {options.map((item) => (
          <SelectItem key={item.value} value={item.value}>
            {item.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
