import Link from "next/link";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { paceButtonBase, paceButtonStyles } from "@/components/features/student/shared/pace-button";

const pill = `${paceButtonBase} ${paceButtonStyles.secondary}`;
const mobileLink = "cursor-pointer text-[13px] font-bold text-pace-purple disabled:opacity-50 md:hidden";

export function NextStepCard({
  number,
  title,
  body,
  quote,
  actionLabel,
  mobileLabel,
  disabled,
  onAction,
  href,
}: {
  number: number;
  title: string;
  body: ReactNode;
  quote?: string;
  actionLabel: string;
  mobileLabel: string;
  disabled?: boolean;
  onAction?: () => void;
  href?: string;
}) {
  return (
    <div className="flex flex-col items-start gap-1.5 rounded-[12px] border border-pace-line p-3 md:gap-2 md:p-3.5">
      <div className="flex items-center gap-2.5">
        <span className="flex size-[22px] items-center justify-center rounded-full bg-pace-purple text-[11px] font-bold uppercase tracking-[0.66px] text-white md:size-6">
          {number}
        </span>
        <h3 className="text-[15px] font-bold">{title}</h3>
      </div>
      <p className="text-[13px] text-pace-ink-2">{body}</p>
      {quote && (
        <p className="hidden w-full rounded-[8px] bg-pace-canvas p-2.5 text-[13px] md:block">“{quote}”</p>
      )}
      {href ? (
        <Link href={href} className={`${pill} max-md:hidden`}>
          {actionLabel}
        </Link>
      ) : (
        <Button variant="outline" disabled={disabled} onClick={onAction} className={`${pill} max-md:hidden`}>
          {actionLabel}
        </Button>
      )}
      {href ? (
        <Link href={href} className={mobileLink}>{mobileLabel} ›</Link>
      ) : (
        <button type="button" disabled={disabled} onClick={onAction} className={mobileLink}>
          {mobileLabel} ›
        </button>
      )}
    </div>
  );
}
