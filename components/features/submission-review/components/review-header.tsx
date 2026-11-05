"use client";
import Image from "next/image";
import { ReviewSelect } from "./review-selects";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { PaceTag } from "@/components/features/student/shared/pace-tag";
import {
  paceButtonBase,
  paceButtonStyles,
} from "@/components/features/student/shared/pace-button";
import type { SubmissionDetail } from "@/components/features/instructor/submissions/detail/types";
import type { SubmissionReview } from "@/lib/submission-review-data";

export function ReviewHeader({
  detail,
  review,
  active,
  onToggleInsights,
  onSelectItem,
}: {
  detail: SubmissionDetail;
  review: SubmissionReview;
  active: number;
  onToggleInsights: () => void;
  onSelectItem: (index: number) => void;
}) {
  const router = useRouter();
  const base = `/dashboard/submissions/${detail.assignment.id}`;
  const flag = review.students.find((s) => s.id === detail.student.id)?.flag ?? "Low";
  return (
    <header className="flex h-[52px] shrink-0 items-center gap-2 border-b border-pace-line pl-1 pr-4 md:h-16 md:gap-4 md:pl-3 md:pr-5">
      <Link
        href={base}
        aria-label="Back to Student work"
        className="flex size-10 shrink-0 items-center justify-center"
      >
        <Image src="/grading/back.svg" alt="" width={24} height={24} />
      </Link>
      <div className="min-w-0 flex-1">
        <h1 className="truncate text-base font-bold">
          <span className="md:hidden">{detail.student.name}</span>
          <span className="hidden md:inline">{detail.assignment.title}</span>
        </h1>
        <p className="truncate text-[11px] font-bold uppercase tracking-[0.66px] text-pace-muted md:text-[13px] md:font-normal md:normal-case md:tracking-normal">
          <span className="block min-w-0 md:hidden">
            <ReviewSelect
              mobile
              label="Item"
              value={String(active)}
              onChange={(value) => onSelectItem(Number(value))}
              options={review.items.map((item, n) => ({
                value: String(n),
                label: `${detail.assignment.title} · Item ${n + 1} of ${review.items.length}`,
              }))}
            />
          </span>
          <span className="hidden md:inline">
            {review.className} · {review.students.length} turned in
          </span>
        </p>
      </div>
      <div className="hidden md:block">
        <ReviewSelect
          label="Student"
          value={detail.student.id}
          options={review.students.map((s) => ({ value: s.id, label: s.name }))}
          onChange={(value) => router.push(`${base}/${value}`)}
        />
      </div>
      <Button
        variant="outline"
        onClick={onToggleInsights}
        className="hidden rounded-full border-pace-purple bg-pace-purple-tint text-pace-purple md:flex"
      >
        ✦ Insights
        <span className="flex size-5 items-center justify-center rounded-full bg-pace-purple text-[11px] font-bold uppercase tracking-[0.66px] text-white">3</span>
      </Button>
      {review.status !== "returned" && (
        <Button
          onClick={() => document.getElementById("return-submission")?.click()}
          className={`${paceButtonBase} ${paceButtonStyles.green} hidden md:flex`}
        >
          Return
        </Button>
      )}
      <span className="shrink-0 md:hidden">
        <PaceTag tone={flag === "High" ? "red" : flag === "Medium" ? "amber" : "neutral"}>{flag === "Medium" ? "Med" : flag}</PaceTag>
      </span>
    </header>
  );
}
