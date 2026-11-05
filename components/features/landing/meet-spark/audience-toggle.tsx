"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

const options = ["Students", "Instructors"] as const;

export function AudienceToggle() {
  const [active, setActive] = useState<(typeof options)[number]>("Students");

  return (
    <div
      role="group"
      aria-label="Audience"
      className="flex items-start overflow-clip rounded-full bg-[#eae9e6]"
    >
      {options.map((option) => (
        <button
          key={option}
          type="button"
          aria-pressed={active === option}
          onClick={() => setActive(option)}
          className={cn(
            "flex h-[46px] w-[170px] items-center justify-center rounded-full font-lp-sans text-[15px] transition-colors sm:h-[52px] sm:w-[207px]",
            active === option
              ? "bg-lp-ink font-semibold text-white"
              : "font-medium text-[#9a9a9a]",
          )}
        >
          {option}
        </button>
      ))}
    </div>
  );
}
