"use client";

import { useState } from "react";
import { filterComments, themeCounts } from "@/lib/study/comment-filter";
import type { StudyComment } from "@/lib/study/dataset";
import type { StudyViewData } from "./study-types";
import { ThemesPanel } from "./comments/themes-panel";
import { CommentFilters } from "./comments/comment-filters";
import { CommentCard } from "./comments/comment-card";
import { EditThemesDialog } from "./comments/edit-themes-dialog";

export function CommentsTab({ comments, themes }: Pick<StudyViewData, "comments" | "themes">) {
  const [themeId, setThemeId] = useState("all");
  const [promptId, setPromptId] = useState("all");
  const [query, setQuery] = useState("");
  const [editing, setEditing] = useState<StudyComment | null>(null);

  const visible = filterComments(comments, { themeId, promptId, query });

  return (
    <div className="flex flex-col gap-5 lg:flex-row lg:items-start">
      <ThemesPanel themes={themes} counts={themeCounts(comments)} selected={themeId} onSelect={setThemeId} />
      <div className="flex min-w-0 flex-1 flex-col gap-4">
        <CommentFilters promptId={promptId} query={query} onPrompt={setPromptId} onQuery={setQuery} />
        {visible.length === 0 ? (
          <p className="rounded-2xl border-[1.5px] border-pace-line bg-white p-10 text-center text-sm text-pace-muted">
            {comments.length === 0 ? "No comments yet." : "No comments match these filters."}
          </p>
        ) : (
          <ul className="flex flex-col gap-3">
            {visible.map((comment) => (
              <CommentCard key={comment.key} comment={comment} themes={themes} onEdit={setEditing} />
            ))}
          </ul>
        )}
        <p className="text-xs text-pace-muted">
          Showing {visible.length} of {comments.length} comments
        </p>
      </div>
      <EditThemesDialog comment={editing} themes={themes} onClose={() => setEditing(null)} />
    </div>
  );
}
