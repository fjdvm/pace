"use client";
import { PaceTag } from "@/components/features/student/shared/pace-tag";
import Link from "next/link";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { returnSubmissions } from "@/app/actions/return-submissions";
import type { SubmissionReview } from "@/lib/submission-review-data";

export function StudentList({
  review,
  postId,
  studentId,
}: {
  review: SubmissionReview;
  postId: string;
  studentId: string;
}) {
  const [selected, setSelected] = useState<string[]>([]);
  const [pending, start] = useTransition();
  const [error, setError] = useState("");
  const router = useRouter();
  return (
    <aside className="hidden w-[260px] shrink-0 flex-col border-r border-pace-line md:flex">
      <h2 className="px-4 pb-2.5 pt-3.5 text-[11px] font-bold uppercase tracking-[0.66px] text-pace-muted">
        Turned in ({review.students.length})
      </h2>
      {review.students.map((s, i) => (
        <div
          key={s.id}
          className={`flex items-center gap-2.5 py-2.5 pl-4 pr-3 ${s.id === studentId ? "bg-pace-green-tint" : ""}`}
        >
          {s.status === "graded" && (
            <input
              type="checkbox"
              aria-label={`Select ${s.name} for return`}
              checked={selected.includes(s.submissionId)}
              onChange={(e) =>
                setSelected(
                  e.target.checked
                    ? [...selected, s.submissionId]
                    : selected.filter((id) => id !== s.submissionId),
                )
              }
            />
          )}
          <span
            className={`flex size-7 shrink-0 items-center justify-center rounded-full text-[11px] font-bold text-white ${["bg-pace-blue", "bg-pace-purple", "bg-pace-red", "bg-pace-green-deep"][i % 4]}`}
          >
            {s.name
              .split(" ")
              .map((n) => n[0])
              .slice(0, 2)
              .join("")}
          </span>
          <Link
            className="min-w-0 flex-1 text-[13px]"
            href={`/dashboard/submissions/${postId}/${s.id}`}
          >
            {s.name}
          </Link>
          <span title={s.status.replace("_", " ")}>
            <PaceTag
              tone={
                s.flag === "High"
                  ? "red"
                  : s.flag === "Medium"
                    ? "amber"
                    : "neutral"
              }
            >
              {s.flag === "Medium" ? "Med" : s.flag}
            </PaceTag>
          </span>
        </div>
      ))}
      {selected.length > 0 && (
        <Button
          disabled={pending}
          className="m-4"
          onClick={() =>
            start(async () => {
              try {
                await returnSubmissions(postId, selected);
                setSelected([]);
                router.refresh();
              } catch (e) {
                setError(e instanceof Error ? e.message : "Could not return");
              }
            })
          }
        >
          Return selected ({selected.length})
        </Button>
      )}
      {error && (
        <p role="alert" className="px-4 text-[13px] text-pace-red">
          {error}
        </p>
      )}
    </aside>
  );
}
