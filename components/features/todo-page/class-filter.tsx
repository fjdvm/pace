"use client";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const ALL_CLASSES = "all";

type ClassFilterProps = {
  classes: { id: string; name: string }[];
  value: string;
  onChange: (id: string) => void;
};

export function ClassFilter({ classes, value, onChange }: ClassFilterProps) {
  const items = [{ value: ALL_CLASSES, label: "All classes" }, ...classes.map((c) => ({ value: c.id, label: c.name }))];
  return (
    <Select value={value} onValueChange={(next) => next && onChange(next)} items={items}>
      <SelectTrigger aria-label="Filter by class" className="h-auto rounded-lg border-pace-line-strong bg-white py-2 pl-3.5 pr-2.5 text-[13px] font-bold leading-normal text-pace-ink">
        <SelectValue />
      </SelectTrigger>
      <SelectContent alignItemWithTrigger={false} align="start">
        {items.map((item) => (
          <SelectItem key={item.value} value={item.value}>
            {item.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
