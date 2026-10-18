"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import type { ThemeDef } from "@/lib/study/themes";
import { UNCODED_ID } from "@/lib/study/themes";
import type { themeCounts } from "@/lib/study/comment-filter";
import { NewThemeForm } from "./new-theme-form";
import { ThemeDot } from "./theme-dot";

type ThemesPanelProps = {
  themes: ThemeDef[];
  counts: ReturnType<typeof themeCounts>;
  selected: string;
  onSelect: (id: string) => void;
};

function Row({ active, onClick, count, children }: { active: boolean; onClick: () => void; count: number; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "flex w-full cursor-pointer items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-left text-[13px] text-pace-ink",
        active && "bg-pace-sunken",
      )}
    >
      <span className="flex items-center gap-2.5">{children}</span>
      <span className="text-pace-ink-2">{count}</span>
    </button>
  );
}

export function ThemesPanel({ themes, counts, selected, onSelect }: ThemesPanelProps) {
  const [adding, setAdding] = useState(false);

  return (
    <aside className="flex flex-col gap-1.5 rounded-[20px] border-[1.5px] border-pace-line bg-white p-4 shadow-[0_3px_0_0_var(--color-pace-line)] lg:w-80 lg:shrink-0">
      <div className="flex items-center justify-between px-2 pb-1.5 pt-1">
        <h2 className="text-[15px] font-bold text-pace-ink">Themes</h2>
        <button type="button" onClick={() => setAdding(true)} className="cursor-pointer text-[13px] font-semibold text-pace-green-deep">
          + New theme
        </button>
      </div>
      {adding && <NewThemeForm onDone={() => setAdding(false)} />}
      <Row active={selected === "all"} onClick={() => onSelect("all")} count={counts.all}>
        All comments
      </Row>
      {themes.map((theme) => (
        <Row key={theme.id} active={selected === theme.id} onClick={() => onSelect(theme.id)} count={counts.byTheme[theme.id] ?? 0}>
          <ThemeDot tone={theme.tone} />
          {theme.label}
        </Row>
      ))}
      <Row active={selected === UNCODED_ID} onClick={() => onSelect(UNCODED_ID)} count={counts.uncoded}>
        <ThemeDot tone="neutral" />
        Not yet coded
      </Row>
      <p className="mt-3 rounded-xl bg-pace-canvas px-3.5 py-3 text-xs leading-relaxed text-pace-ink-2">
        Themes are coded by the research team. A comment can have more than one theme.
      </p>
    </aside>
  );
}
