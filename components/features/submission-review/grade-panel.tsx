"use client";

import { useState } from "react";
import { useGradeDraft } from "./components/use-grade-draft";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  paceButtonBase,
  paceButtonStyles,
} from "@/components/features/student/shared/pace-button";
import type { SubmissionReview } from "@/lib/submission-review-data";

export function GradePanel({
  review,
  postId,
  name,
}: {
  review: SubmissionReview;
  postId: string;
  name: string;
}) {
  const [commentOpen, setCommentOpen] = useState(false);
  const {
    grades,
    setGrades,
    finalGrade,
    setFinalGrade,
    feedback,
    setFeedback,
    error,
    pending,
    returned,
    total,
    sum,
    act,
  } = useGradeDraft(review, postId);
  return (
    <section
      id="grade"
      className="flex flex-col gap-4 bg-white md:min-h-full md:border-l md:border-pace-line md:px-5 md:py-6"
    >
      <h2 className="hidden text-base font-bold md:block">Grade</h2>
      <div className="hidden justify-between text-[13px] md:flex">
        <span className="text-pace-ink-2">
          Items 1–{review.items.length} (automatic)
        </span>
        <b>
          {review.items.reduce((s, i) => s + i.autoGrade, 0)}/{total}
        </b>
      </div>

      <label className="flex flex-col gap-2 text-[13px] font-semibold">
        <span className="md:hidden">Grade</span>
        <span className="hidden md:block">Final grade</span>
        <div className="flex h-12 items-center rounded-[12px] border-[1.5px] border-pace-line-strong px-4">
          <Input
            type="number"
            min={0}
            max={total}
            step="any"
            disabled={pending || returned}
            aria-label="Final grade"
            placeholder={String(sum)}
            value={finalGrade}
            onChange={(e) => setFinalGrade(e.target.value)}
            className="h-auto border-0 p-0 text-[15px] shadow-none ring-0"
          />
          <span className="shrink-0 text-pace-muted">/ {total}</span>
        </div>
      </label>
      <label
        className={`${commentOpen ? "flex" : "hidden"} flex-col gap-2 text-[13px] font-semibold md:flex`}
        id="private-feedback"
      >
        Private comment
        <Textarea
          value={feedback}
          disabled={pending || returned}
          maxLength={10000}
          onChange={(e) => setFeedback(e.target.value)}
          placeholder="Add feedback for the Student"
          className="min-h-12 rounded-[12px] border-[1.5px] border-pace-line-strong text-[15px] font-normal"
        />
      </label>
      <details className="text-[13px]">
        <summary className="cursor-pointer text-pace-green-deep">
          Adjust Item scores
        </summary>
        <div className="mt-3 flex flex-col gap-3">
          {review.items.map((item, index) => (
            <label
              key={item.id}
              className="flex items-center justify-between gap-2"
            >
              Item {index + 1} / {item.points}
              <Input
                aria-label={`Item ${index + 1} grade`}
                type="number"
                min={0}
                max={item.points}
                step="any"
                disabled={pending || returned}
                value={grades[index].grade ?? ""}
                className="w-24"
                onChange={(e) =>
                  setGrades(
                    grades.map((g, n) =>
                      n === index
                        ? {
                            ...g,
                            grade:
                              e.target.value === ""
                                ? null
                                : Number(e.target.value),
                          }
                        : g,
                    ),
                  )
                }
              />
            </label>
          ))}
        </div>
      </details>
      {error && (
        <p role="alert" className="text-[13px] text-pace-red">
          {error}
        </p>
      )}
      {returned ? (
        <p className="font-bold text-pace-green-deep">Returned</p>
      ) : (
        <>
          <Button
            id="return-submission"
            disabled={pending}
            onClick={() => act("return")}
            className={`${paceButtonBase} ${paceButtonStyles.green} hidden h-[52px] w-full md:flex`}
          >
            Return to {name.split(" ")[0]}
          </Button>
          <Button
            variant="outline"
            disabled={pending}
            onClick={() => act("save")}
          >
            Save draft grade
          </Button>
          {review.status === "graded" && (
            <Button
              variant="ghost"
              disabled={pending}
              onClick={() => act("delete")}
            >
              Delete draft grade
            </Button>
          )}
          <div className="fixed inset-x-0 bottom-0 z-20 flex gap-3 border-t border-pace-line bg-white px-4 pb-7 pt-3 md:hidden">
            <Button
              variant="outline"
              className={`${paceButtonBase} ${paceButtonStyles.secondary} h-[52px] flex-1`}
              onClick={() => {
                setCommentOpen(true);
                requestAnimationFrame(() =>
                  document
                    .getElementById("private-feedback")
                    ?.scrollIntoView({ behavior: "smooth" }),
                );
              }}
            >
              Comment
            </Button>
            <Button
              disabled={pending}
              onClick={() => act("return")}
              className={`${paceButtonBase} ${paceButtonStyles.green} h-[52px] flex-1`}
            >
              Return
            </Button>
          </div>
        </>
      )}
    </section>
  );
}
