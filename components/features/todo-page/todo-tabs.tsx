import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { TodoTab } from "./group-todos";

const TABS: { value: TodoTab; label: string }[] = [
  { value: "assigned", label: "Assigned" },
  { value: "missing", label: "Missing" },
  { value: "done", label: "Done" },
];

type TodoTabsProps = {
  value: TodoTab;
  onChange: (tab: TodoTab) => void;
};

export function TodoTabs({ value, onChange }: TodoTabsProps) {
  return (
    <Tabs value={value} onValueChange={(next) => onChange(next as TodoTab)} className="gap-0 border-b border-pace-line">
      <TabsList variant="line" className="h-auto w-full justify-center gap-2 p-0">
        {TABS.map((tab) => (
          <TabsTrigger
            key={tab.value}
            value={tab.value}
            className="h-auto w-[100px] flex-none flex-col items-center justify-end gap-3 rounded-none px-4 pt-3.5 pb-0 text-[15px] font-normal leading-[1.55] text-pace-ink-2 after:static after:h-1 after:w-full after:rounded-t-[3px] after:bg-transparent after:opacity-100 data-active:font-bold data-active:text-pace-green-deep data-active:after:bg-pace-green"
          >
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}
