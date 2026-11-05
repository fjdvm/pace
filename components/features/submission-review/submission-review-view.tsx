"use client";
import { ItemReviewTabs } from "./components/item-review-tabs";
import { ShortAnswerReview } from "./components/short-answer-review";
import { ChoiceOptions } from "@/components/features/student/workspace/choice-options";
import Link from "next/link";
import { useState } from "react";
import { JetBrains_Mono } from "next/font/google";
import { Button } from "@/components/ui/button";
import { PaceTag } from "@/components/features/student/shared/pace-tag";
import { ReviewTabsPanel } from "@/components/features/instructor/submissions/detail/review-tabs-panel";
import type { SubmissionDetail } from "@/components/features/instructor/submissions/detail/types";
import type { SubmissionReview } from "@/lib/submission-review-data";
import { ReviewHeader } from "./components/review-header";
import type { SubmissionHistory } from "@/lib/submission-history";
import { SubmissionHistoryView } from "./components/submission-history-view";
import { GradePanel } from "./grade-panel";
import { ReviewActivity } from "./review-activity";
import { StudentList } from "./student-list";

const reviewMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export function SubmissionReviewView({
  detail,
  review,
  history,
}: {
  detail: SubmissionDetail;
  review: SubmissionReview;
  history: SubmissionHistory;
}) {
  const [active, setActive] = useState(0);
  const [insights, setInsights] = useState(false);
  const item = review.items[active];
  const tests = item.tests;
  const visible = tests.filter((t) => t.visible !== false);
  const hidden = tests.filter((t) => t.visible === false);
  const base = `/dashboard/submissions/${detail.assignment.id}`;
  return (
    <div
      className={`${reviewMono.variable} flex min-h-dvh flex-col bg-white text-pace-ink`}
    >
      <ReviewHeader
        detail={detail}
        review={review}
        active={active}
        onSelectItem={setActive}
        onToggleInsights={() => setInsights(!insights)}
      />
      <div className="flex flex-1">
        <StudentList
          review={review}
          postId={detail.assignment.id}
          studentId={detail.student.id}
        />
        <div className="flex min-w-0 flex-1 flex-col md:flex-row">
          <main className="flex min-w-0 flex-1 flex-col gap-3 p-4 pb-3 md:gap-4 md:p-6">
            <ItemReviewTabs
              items={review.items}
              active={active}
              onSelect={setActive}
            >
              {item.kind === "short_answer" ? (
                <ShortAnswerReview item={item} />
              ) : item.kind === "multiple_choice" ? (
                <section className="space-y-3">
                  <h2 className="text-[22px] font-bold">{item.title}</h2>
                  <ChoiceOptions
                    options={item.options}
                    value={item.code}
                    disabled
                  />
                  <p className="text-sm">
                    Chosen option:{" "}
                    {item.options[Number(item.code)] && item.code !== ""
                      ? item.options[Number(item.code)]
                      : "Unanswered"}
                  </p>
                  <p className="text-sm">
                    Auto score: {item.autoGrade}/{item.points} · Correct answer:{" "}
                    {item.options[item.correctOption ?? -1]}
                  </p>
                </section>
              ) : (
                <>
                  <div className="hidden items-center gap-3 text-[13px] md:flex">
                    <b>{item.language === "Python" ? "main.py" : "main"}</b>
                    <span className="text-pace-muted">
                      Turned in{" "}
                      {new Date(detail.submittedAt!).toLocaleString("en-US", {
                        month: "short",
                        day: "numeric",
                        hour: "numeric",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                  <div className="overflow-x-auto rounded-[8px] border-pace-line bg-pace-canvas p-3 md:border">
                    <pre className="font-mono text-[13px] leading-[1.65]">
                      {item.code.split("\n").map((line, i) => (
                        <div key={i} className="flex gap-5 py-[3px]">
                          <span className="w-4 shrink-0 text-right text-pace-muted">
                            {i + 1}
                          </span>
                          <code>{line || " "}</code>
                        </div>
                      ))}
                    </pre>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <PaceTag>
                      <span className="md:hidden">
                        Tests {tests.filter((t) => t.passed).length}/
                        {tests.length}
                      </span>
                      <span className="hidden md:inline">
                        Visible tests {visible.filter((t) => t.passed).length}/
                        {visible.length}
                      </span>
                    </PaceTag>
                    <span className="hidden md:inline">
                      <PaceTag>
                        Hidden tests {hidden.filter((t) => t.passed).length}/
                        {hidden.length}
                      </PaceTag>
                    </span>
                    <PaceTag tone="neutral">
                      {detail.heartsUsed} heart
                      {detail.heartsUsed === 1 ? "" : "s"} used
                    </PaceTag>
                  </div>
                </>
              )}
            </ItemReviewTabs>
            <ReviewActivity detail={detail} />
            <SubmissionHistoryView history={history} detail={detail} />
            <Button
              variant="outline"
              onClick={() => setInsights(!insights)}
              className="h-[46px] rounded-[12px] border-pace-purple bg-pace-purple-tint text-pace-purple md:hidden"
            >
              ✦ Insights
            </Button>
            {insights && <ReviewTabsPanel detail={detail} />}
            <p className="hidden rounded-[8px] bg-pace-canvas px-4 py-3 text-[13px] text-pace-ink-2 md:block">
              {detail.similar
                ? `Code similarity: ${Math.round(detail.similar.similarity * 100)}% similar to ${detail.similar.name}.`
                : "Code similarity: no other submission is more than 80% similar."}
            </p>
          </main>
          <aside className="px-4 pb-32 md:w-[320px] md:shrink-0 md:p-0">
            <GradePanel
              key={review.submissionId + review.status}
              review={review}
              postId={detail.assignment.id}
              name={detail.student.name}
            />
            {detail.neighbors.nextId && (
              <Link
                className="hidden px-5 text-[13px] font-bold text-pace-green-deep md:block"
                href={`${base}/${detail.neighbors.nextId}`}
              >
                Next Student →
              </Link>
            )}
          </aside>
        </div>
      </div>
    </div>
  );
}
