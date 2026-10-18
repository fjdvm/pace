import { cn } from "@/lib/utils";
import type { StudyTab } from "./study-types";

const tabs: { id: StudyTab; label: string }[] = [
  { id: "overview", label: "Overview" },
  { id: "items", label: "Items" },
  { id: "comments", label: "Comments" },
  { id: "respondents", label: "Respondents" },
];

type StudyTabsProps = {
  active: StudyTab;
  onChange: (tab: StudyTab) => void;
};

export function StudyTabs({ active, onChange }: StudyTabsProps) {
  return (
    <div role="tablist" className="flex w-fit max-w-full gap-1 overflow-x-auto [scrollbar-width:none] rounded-full border-[1.5px] border-pace-line bg-white p-1">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          role="tab"
          aria-selected={active === tab.id}
          onClick={() => onChange(tab.id)}
          className={cn(
            "cursor-pointer rounded-full px-4 py-1.5 text-[13px] font-semibold",
            active === tab.id ? "bg-pace-ink text-white" : "text-pace-ink-2",
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
