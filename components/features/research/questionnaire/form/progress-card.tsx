"use client";

import { motion, useReducedMotion } from "motion/react";

type Props = { label: string; answered: number; total: number };

export function ProgressCard({ label, answered, total }: Props) {
  const reduced = useReducedMotion();
  const percent = total === 0 ? 0 : (answered / total) * 100;

  return (
    <div className="sticky top-24 z-30 flex flex-col gap-2.5 rounded-[18px] border border-lp-line bg-white p-[18px]">
      <div className="flex gap-2 text-sm">
        <p className="min-w-0 flex-1 font-semibold text-lp-ink">{label}</p>
        <p className="whitespace-nowrap font-medium text-lp-muted">
          {answered} of {total} answered
        </p>
      </div>
      <div
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={total}
        aria-valuenow={answered}
        className="h-2 overflow-hidden rounded-full bg-[#eae9e6]"
      >
        <motion.div
          className="h-2 rounded-full bg-[#2bc84e]"
          initial={false}
          animate={{ width: `${percent}%` }}
          transition={{ duration: reduced ? 0 : 0.4, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}
