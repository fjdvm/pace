"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { THEMES } from "@/lib/study/questionnaire";
import { PaceTag } from "@/components/features/student/shared/pace-tag";
import type { StudyViewData } from "./study-types";

const toneFor = (themeId: string) => THEMES.find((t) => t.id === themeId)?.tone ?? "neutral";

export function CommentsTab({ comments }: { comments: StudyViewData["comments"] }) {
  const [theme, setTheme] = useState("all");
  const options = [{ id: "all", label: "All" }, ...THEMES];
  const visible = theme === "all" ? comments : comments.filter((c) => c.themeId === theme);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-2" role="group" aria-label="Filter comments by theme">
        {options.map((o) => (
          <button
            key={o.id}
            type="button"
            onClick={() => setTheme(o.id)}
            className={cn(
              "cursor-pointer rounded-full px-4 py-1.5 text-[13px] font-semibold",
              theme === o.id ? "bg-pace-ink text-white" : "border-[1.5px] border-pace-line-strong bg-white text-pace-ink",
            )}
          >
            {o.label}
          </button>
        ))}
      </div>
      <ul className="flex flex-col gap-3">
        {visible.map((comment) => (
          <li
            key={`${comment.respondentId}-${comment.themeId}`}
            className="flex flex-col gap-2 rounded-2xl border-[1.5px] border-pace-line bg-white p-4"
          >
            <p className="text-sm text-pace-ink">&ldquo;{comment.text}&rdquo;</p>
            <div className="flex flex-wrap items-center gap-2 text-xs text-pace-muted">
              <PaceTag tone={comment.role === "student" ? "green" : "purple"} className="px-2.5 py-0.5 text-[11px]">
                {comment.role === "student" ? "Student" : "Instructor"}
              </PaceTag>
              <PaceTag tone={toneFor(comment.themeId)} className="px-2.5 py-0.5 text-[11px]">
                {THEMES.find((t) => t.id === comment.themeId)?.label}
              </PaceTag>
              <span className="font-mono">{comment.respondentId}</span>
            </div>
          </li>
        ))}
      </ul>
      <p className="text-xs text-pace-muted">
        Showing {visible.length} of {comments.length} comments
      </p>
    </div>
  );
}
