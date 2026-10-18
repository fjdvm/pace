"use client";

import Link from "next/link";
import { MenuIcon, PanelLeftIcon } from "lucide-react";
import { NotificationBell } from "@/components/features/notifications/notification-bell";
import { useSidebarCollapse } from "@/components/features/dashboard/use-sidebar-collapse";
import { PaceIcon } from "./pace-icon";

type StudentTopBarProps = {
  title: string;
  subtitle?: string;
  backHref?: string;
  leadingIcon?: React.ReactNode;
};

export function StudentTopBar({ title, subtitle, backHref, leadingIcon }: StudentTopBarProps) {
  const { collapsed, toggleCollapsed, toggleMobileOpen } = useSidebarCollapse();

  return (
    <header className="flex shrink-0 items-center gap-4 border-b border-pace-line bg-white px-4 py-5 md:px-10">
      <button
        type="button"
        onClick={toggleMobileOpen}
        aria-label="Open menu"
        className="inline-flex shrink-0 cursor-pointer md:hidden"
      >
        <MenuIcon className="size-5 text-pace-ink-2" />
      </button>
      <button
        type="button"
        onClick={toggleCollapsed}
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        className="hidden shrink-0 cursor-pointer md:inline-flex"
      >
        <PanelLeftIcon className="size-5 text-pace-ink-2" />
      </button>
      <div className="flex min-w-0 items-center gap-3">
        {backHref && (
          <Link href={backHref} aria-label="Back" className="shrink-0">
            <PaceIcon name="arrow-left" size={18} />
          </Link>
        )}
        {leadingIcon}
        <div className="flex min-w-0 flex-col gap-0.5">
          <h1 suppressHydrationWarning className="truncate text-[22px] font-bold leading-tight tracking-[-0.01em] text-pace-ink">{title}</h1>
          {subtitle && <p suppressHydrationWarning className="truncate text-[13px] leading-normal text-pace-ink-2">{subtitle}</p>}
        </div>
      </div>
      <div className="flex-1" />
      <div className="flex size-10 shrink-0 items-center justify-center rounded-full border-[1.5px] border-pace-line">
        <NotificationBell />
      </div>
    </header>
  );
}
