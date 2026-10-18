import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { StudyResults } from "@/lib/study/analysis";
import { StudyCard } from "./study-card";

const fills = { green: "bg-pace-green", red: "bg-pace-red", amber: "bg-pace-amber", blue: "bg-pace-blue", neutral: "bg-pace-line-strong" };

type ThemesCardProps = {
  themes: StudyResults["themes"];
  commentCount: number;
  onSeeAll: () => void;
};

export function ThemesCard({ themes, commentCount, onSeeAll }: ThemesCardProps) {
  const coded = themes.filter((t) => t.tone !== "neutral").sort((a, b) => b.count - a.count);
  const max = Math.max(1, ...coded.map((t) => t.count));
  return (
    <StudyCard title="Top themes in comments" subtitle={`${commentCount} comments, coded by the team · SOP 4`}>
      <div className="flex flex-col gap-3.5">
        {coded.map((theme) => (
          <div key={theme.id} className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between gap-3 text-xs">
              <span className="text-pace-ink">{theme.label}</span>
              <span className="font-bold text-pace-ink">{theme.count}</span>
            </div>
            <div className="h-1.5 rounded-full bg-pace-sunken">
              <div className={cn("h-full rounded-full", fills[theme.tone])} style={{ width: `${(theme.count / max) * 100}%` }} />
            </div>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={onSeeAll}
        className="flex w-fit cursor-pointer items-center gap-1.5 text-xs font-semibold text-pace-ink"
      >
        See all comments <ArrowRight className="size-3.5" />
      </button>
    </StudyCard>
  );
}
