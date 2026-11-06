"use client";

import { cn } from "@/lib/utils";
import { slugify } from "./slugify";
import { useActiveSection } from "./use-active-section";

export function Toc({ titles }: { titles: string[] }) {
  const active = useActiveSection(titles.map(slugify));

  return (
    <nav aria-label="On this page" className="sticky top-8 hidden w-[250px] shrink-0 flex-col gap-3 self-start lg:flex">
      <p className="text-[13px] font-semibold text-lp-faint">On this page</p>
      {titles.map((title) => (
        <a
          key={title}
          href={`#${slugify(title)}`}
          className={cn(
            "rounded-[10px] px-3 py-[7px] text-sm transition-colors",
            active === slugify(title) ? "bg-lp-canvas font-semibold text-lp-ink" : "text-lp-muted hover:text-lp-ink",
          )}
        >
          {title}
        </a>
      ))}
    </nav>
  );
}
