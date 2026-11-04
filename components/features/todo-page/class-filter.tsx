"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const ALL_CLASSES = "all";

type ClassFilterProps = {
  classes: { id: string; name: string }[];
  value: string;
  onChange: (id: string) => void;
};

export function ClassFilter({ classes, value, onChange }: ClassFilterProps) {
  const items = [
    { value: ALL_CLASSES, label: "All classes" },
    ...classes.map((c) => ({ value: c.id, label: c.name })),
  ];
  return (
    <Select
      value={value}
      onValueChange={(next) => next && onChange(next)}
      items={items}
    >
      <SelectTrigger
        aria-label="Filter by class"
        className="h-auto min-w-0 max-w-full rounded-full border-pace-line-strong bg-white py-2 pl-3.5 pr-2.5 text-[13px] font-bold leading-normal text-pace-ink"
      >
        <SelectValue className="min-w-0 truncate" />
      </SelectTrigger>
      <SelectContent
        alignItemWithTrigger={false}
        align="start"
        className="w-max min-w-(--anchor-width) max-w-[min(28rem,calc(100vw-2rem))] p-1"
      >
        {items.map((item) => (
          <SelectItem
            key={item.value}
            value={item.value}
            className="items-start rounded-md px-3 py-2 [&>span:first-child]:min-w-0 [&>span:first-child]:shrink [&>span:first-child]:whitespace-normal"
          >
            <span className="min-w-0 whitespace-normal break-words">
              {item.label}
            </span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
