"use client";

import Link from "next/link";
import { NotificationBell } from "@/components/features/notifications/notification-bell";
import { PaceIcon } from "./pace-icon";

type StudentTopBarProps = {
  title: string;
  subtitle?: React.ReactNode;
  backHref?: string;
  leadingIcon?: React.ReactNode;
  actions?: React.ReactNode;
  hideBell?: boolean;
};

export function StudentTopBar({ title, subtitle, backHref, leadingIcon, actions, hideBell }: StudentTopBarProps) {
  return (
    <header className="flex shrink-0 flex-wrap items-center gap-x-4 gap-y-3 border-b border-pace-line bg-white px-4 py-5 md:px-10">
      <div className="flex min-w-0 flex-1 items-center gap-3 sm:flex-none">
        {backHref && (
          <Link href={backHref} aria-label="Back" className="shrink-0">
            <PaceIcon name="arrow-left" size={18} />
          </Link>
        )}
        {leadingIcon}
        <div className="flex min-w-0 flex-col gap-0.5">
          <h1 suppressHydrationWarning className="sm:truncate text-[22px] font-bold leading-tight tracking-[-0.01em] text-pace-ink">{title}</h1>
          {subtitle && <div suppressHydrationWarning className="flex flex-wrap items-center gap-x-2 text-[13px] sm:truncate leading-normal text-pace-ink-2">{subtitle}</div>}
        </div>
      </div>
      <div className="flex-1" />
      {actions && <div className="max-sm:order-last max-sm:w-full">{actions}</div>}
      {!hideBell && (
        <div className="flex size-10 shrink-0 items-center justify-center rounded-full border-[1.5px] border-pace-line">
          <NotificationBell />
        </div>
      )}
    </header>
  );
}
