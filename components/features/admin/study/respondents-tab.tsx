"use client";

import { useState } from "react";
import { PaceTag } from "@/components/features/student/shared/pace-tag";
import type { StudyViewData } from "./study-types";

const PAGE_SIZE = 25;
const date = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" });
const grid = "grid min-w-[640px] grid-cols-[0.8fr_1fr_1.2fr_0.9fr_0.9fr_0.9fr] items-center gap-4 px-6";

export function RespondentsTab({ respondents }: { respondents: StudyViewData["respondents"] }) {
  const [count, setCount] = useState(PAGE_SIZE);
  const visible = respondents.slice(0, count);

  if (respondents.length === 0) {
    return <p className="rounded-2xl border-[1.5px] border-pace-line bg-white p-10 text-center text-sm text-pace-muted">No responses yet.</p>;
  }

  return (
    <section className="overflow-hidden rounded-[20px] border-[1.5px] border-pace-line bg-white shadow-[0_3px_0_0_var(--color-pace-line)]">
      <div className="overflow-x-auto">
        <div className={`${grid} bg-pace-canvas py-2.5`}>
          {["Respondent", "Group", "Submitted", "Year level", "Courses", "AI tools"].map((h) => (
            <span key={h} className="text-[11px] font-bold uppercase tracking-[0.06em] text-pace-muted">
              {h}
            </span>
          ))}
        </div>
        {visible.map((r) => (
          <div key={r.id} className={`${grid} border-t border-pace-line py-3`}>
            <span className="font-mono text-xs text-pace-ink">{r.id}</span>
            <span>
              <PaceTag tone={r.role === "student" ? "green" : "purple"} className="px-2.5 py-0.5 text-[11px]">
                {r.role === "student" ? "Student" : "Instructor"}
              </PaceTag>
            </span>
            <span className="text-[13px] text-pace-ink-2">{date.format(new Date(r.submittedAt))}</span>
            <span className="text-[13px] text-pace-ink-2">{r.profile?.yearLevel ?? "—"}</span>
            <span className="text-[13px] text-pace-ink-2">{r.profile?.coursesTaken ?? "—"}</span>
            <span className="text-[13px] capitalize text-pace-ink-2">{r.profile?.aiUsage ?? "—"}</span>
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between border-t border-pace-line px-6 py-3 text-xs text-pace-muted">
        <span>
          Showing {visible.length} of {respondents.length} respondents · answers are anonymous
        </span>
        {count < respondents.length && (
          <button type="button" onClick={() => setCount((n) => n + PAGE_SIZE)} className="cursor-pointer font-semibold text-pace-ink">
            Show more
          </button>
        )}
      </div>
    </section>
  );
}
