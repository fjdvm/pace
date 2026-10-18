"use client";

import Link from "next/link";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { PaceIcon } from "@/components/features/student/shared/pace-icon";
import { PaceTag } from "@/components/features/student/shared/pace-tag";
import { ProgressBar } from "@/components/features/student/shared/progress-bar";
import { describeReward, type SubmitReward } from "./reward";

type ResultModalProps = {
  open: boolean;
  onClose: () => void;
  score: number;
  passed: number;
  total: number;
  reward: SubmitReward | null;
  backHref: string;
};

function Stat({ value, label, tone }: { value: string; label: string; tone: string }) {
  return (
    <div className={`flex flex-1 flex-col items-center gap-0.5 rounded-2xl py-3.5 ${tone}`}>
      <span className="text-[32px] font-bold leading-[1.15] tracking-[-0.015em] text-pace-ink">{value}</span>
      <span className="text-[13px] text-pace-ink-2">{label}</span>
    </div>
  );
}

export function ResultModal({ open, onClose, score, passed, total, reward, backHref }: ResultModalProps) {
  const info = reward ? describeReward(reward, passed) : null;
  const perfect = total > 0 && passed === total;

  return (
    <Dialog open={open} onOpenChange={(next) => !next && onClose()}>
      <DialogContent
        showCloseButton={false}
        className="flex max-w-[calc(100%-2rem)] flex-col items-center gap-[22px] rounded-3xl bg-white px-6 pb-8 pt-9 shadow-[0_12px_32px_-4px_rgba(20,20,20,0.12)] ring-0 sm:max-w-[520px] sm:px-9"
      >
        <span className="flex size-[72px] items-center justify-center rounded-full bg-pace-green">
          <PaceIcon name="workspace/check-white-36" size={36} />
        </span>
        <DialogTitle className="text-center text-[30px] font-bold leading-[1.15] tracking-[-0.02em] text-pace-ink">
          {perfect ? `Submitted! All ${total} tests passed.` : `Submitted! ${passed} of ${total} tests passed.`}
        </DialogTitle>
        <DialogDescription className="max-w-[420px] text-center text-[15px] leading-[1.55] text-pace-ink-2">
          {perfect ? "Including the hidden tests. Nice work." : "Your instructor can see exactly where it went wrong."}
        </DialogDescription>
        <div className="flex w-full gap-3">
          <Stat value={`${Math.round(score)}%`} label="Score" tone="bg-pace-canvas" />
          {reward && <Stat value={String(reward.heartsUsed)} label="Hearts used" tone="bg-pace-canvas" />}
          {info && <Stat value={`+${info.earned}`} label="XP earned" tone="bg-pace-amber-tint" />}
        </div>
        {info && (
          <>
            <div className="flex w-full flex-col gap-2">
              {info.rows.map((row) => (
                <div key={row.label} className="flex justify-between text-[13px] leading-normal">
                  <span className="text-pace-ink-2">{row.label}</span>
                  <span className="font-semibold text-pace-ink">+{row.xp}</span>
                </div>
              ))}
            </div>
            <div className="flex w-full flex-col gap-2 rounded-[14px] bg-pace-canvas p-3.5">
              <div className="flex items-center text-[13px] font-bold leading-normal text-pace-ink">
                {info.leveledUp ? `Level ${info.level} reached` : `Level ${info.level}`}
                <span className="flex-1" />
                <PaceTag tone="amber">{reward?.totalXp} XP</PaceTag>
              </div>
              <ProgressBar tone="amber" value={info.levelProgress} />
            </div>
          </>
        )}
        <p className="flex items-center gap-2 text-center text-[13px] leading-normal text-pace-muted">
          <PaceIcon name="workspace/eye" size={14} />
          Your instructor sees your code, test results, and tutor chat.
        </p>
        <div className="flex w-full gap-3">
          <button
            type="button"
            onClick={onClose}
            className="h-[52px] flex-1 cursor-pointer rounded-full border-[1.5px] border-pace-line-strong bg-white px-7 text-[15px] font-bold text-pace-ink shadow-[0_3px_0_var(--color-pace-line-strong)]"
          >
            Review my code
          </button>
          <Link
            href={backHref}
            className="flex h-[52px] flex-1 items-center justify-center rounded-full bg-pace-ink px-7 text-[15px] font-bold text-white"
          >
            Back to class
          </Link>
        </div>
      </DialogContent>
    </Dialog>
  );
}
