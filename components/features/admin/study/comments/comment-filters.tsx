import { Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { COMMENT_PROMPTS } from "@/lib/study/questionnaire";

type CommentFiltersProps = {
  promptId: string;
  query: string;
  onPrompt: (id: string) => void;
  onQuery: (query: string) => void;
};

export function CommentFilters({ promptId, query, onPrompt, onQuery }: CommentFiltersProps) {
  const options = [{ id: "all", label: "All questions" }, ...COMMENT_PROMPTS.map((p) => ({ id: p.id, label: p.short }))];
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by question">
        {options.map((o) => (
          <button
            key={o.id}
            type="button"
            onClick={() => onPrompt(o.id)}
            className={cn(
              "cursor-pointer rounded-full px-3.5 py-2 text-[13px] font-semibold",
              promptId === o.id ? "bg-pace-ink text-white" : "border-[1.5px] border-pace-line-strong bg-white text-pace-ink",
            )}
          >
            {o.label}
          </button>
        ))}
      </div>
      <label className="flex h-10 w-full items-center gap-2 rounded-full border-[1.5px] border-pace-line bg-white px-4 sm:w-56">
        <Search className="size-3.5 text-pace-muted" />
        <input
          value={query}
          onChange={(e) => onQuery(e.target.value)}
          placeholder="Search comments"
          aria-label="Search comments"
          className="min-w-0 flex-1 bg-transparent text-[13px] text-pace-ink outline-none placeholder:text-pace-muted"
        />
      </label>
    </div>
  );
}
