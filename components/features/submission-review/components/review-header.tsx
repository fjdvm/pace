"use client";
import Image from "next/image";
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
  const flag = detail.signals?.riskScore?.flag ?? "Low";
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
          <select
            aria-label="Item"
            value={active}
            onChange={(e) => onSelectItem(Number(e.target.value))}
            className="max-w-full appearance-none border-0 bg-transparent font-inherit text-inherit uppercase md:hidden"
          >
            {review.items.map((item, n) => (
              <option value={n} key={item.id}>
                {detail.assignment.title} · Item {n + 1} of{" "}
                {review.items.length}
              </option>
            ))}
          </select>
          <span className="hidden md:inline">
            {review.className} · {review.students.length} turned in
          </span>
        </p>
      </div>
      <div className="relative hidden md:block">
        <select
          aria-label="Student"
          value={detail.student.id}
          onChange={(e) => router.push(`${base}/${e.target.value}`)}
          className="h-[42px] appearance-none rounded-[8px] border border-pace-line-strong bg-white py-2 pl-3.5 pr-10 text-[13px] font-bold"
        >
          {review.students.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>
        <Image
          src="/grading/chevron-down.svg"
          alt=""
          width={24}
          height={24}
          className="pointer-events-none absolute right-2.5 top-[9px]"
        />
      </div>
      <Button
        variant="outline"
        onClick={onToggleInsights}
        className="hidden rounded-full border-pace-purple bg-pace-purple-tint text-pace-purple md:flex"
      >
        ✦ Insights
      </Button>
      {review.status !== "returned" && (
        <Button
          onClick={() => document.getElementById("return-submission")?.click()}
          className={`${paceButtonBase} ${paceButtonStyles.green} hidden md:flex`}
        >
          Return
        </Button>
      )}
      <span className="md:hidden">
        <PaceTag tone={flag === "High" ? "red" : "neutral"}>{flag}</PaceTag>
      </span>
    </header>
  );
}
