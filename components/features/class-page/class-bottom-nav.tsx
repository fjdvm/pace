import Image from "next/image";
import { cn } from "@/lib/utils";
import { tabsFor } from "./tab-config";
import type { ClassPageTab } from "./types";

type ClassBottomNavProps = {
  active: ClassPageTab;
  isInstructor: boolean;
  onChange: (tab: ClassPageTab) => void;
};

export function ClassBottomNav({ active, isInstructor, onChange }: ClassBottomNavProps) {
  return (
    <nav className="flex shrink-0 items-start justify-between border-t border-pace-line bg-white px-6 pb-[22px] pt-[10px] md:hidden">
      {tabsFor(isInstructor).map((tab) => {
        const selected = active === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChange(tab.id)}
            aria-current={selected ? "page" : undefined}
            className="flex w-24 cursor-pointer flex-col items-center gap-1"
          >
            <span className={cn("flex h-8 w-16 items-center justify-center rounded-2xl", selected && "bg-pace-green-tint")}>
              <Image src={`/class/${tab.icon}.svg`} alt="" width={24} height={24} />
            </span>
            <span className={cn("text-[13px] leading-normal", selected ? "font-bold text-pace-green-deep" : "text-pace-ink-2")}>
              {tab.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
