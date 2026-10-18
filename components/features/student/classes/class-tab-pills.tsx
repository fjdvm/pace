import { cn } from "@/lib/utils";
import { PaceIcon } from "@/components/features/student/shared/pace-icon";

export type StudentClassTab = "classwork" | "stream" | "people" | "leaderboard";

const tabs: { id: StudentClassTab; label: string; icon: string; activeIcon: string }[] = [
  { id: "classwork", label: "Classwork", icon: "book-gray", activeIcon: "book-white" },
  { id: "stream", label: "Stream", icon: "megaphone", activeIcon: "megaphone" },
  { id: "people", label: "People", icon: "users", activeIcon: "users" },
  { id: "leaderboard", label: "Leaderboard", icon: "trophy-gray", activeIcon: "trophy-white" },
];

type ClassTabPillsProps = {
  active: StudentClassTab;
  onChange: (tab: StudentClassTab) => void;
};

export function ClassTabPills({ active, onChange }: ClassTabPillsProps) {
  return (
    <div className="max-w-full overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      <div
        role="tablist"
        className="flex w-max gap-1 rounded-full border-[1.5px] border-pace-line bg-white p-1"
      >
        {tabs.map((tab) => {
          const selected = active === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={selected}
              onClick={() => onChange(tab.id)}
              className={cn(
                "flex cursor-pointer items-center gap-1.5 rounded-full px-4 py-2 text-[13px] font-semibold",
                selected ? "bg-pace-ink text-white" : "text-pace-ink-2",
              )}
            >
              <PaceIcon name={selected ? tab.activeIcon : tab.icon} size={15} />
              {tab.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
