"use client";

import { usePathname } from "next/navigation";
import { BarChart3, Settings } from "lucide-react";
import { SidebarNavItem } from "@/components/features/student/sidebar/sidebar-nav-item";

type AdminSectionProps = {
  collapsed: boolean;
  onNavigate?: () => void;
};

export function AdminSection({ collapsed, onNavigate }: AdminSectionProps) {
  const pathname = usePathname();
  const nav = { collapsed, onNavigate };

  return (
    <nav aria-label="Admin" className="mt-4 grid gap-1 border-t border-pace-line pt-3">
      {!collapsed && <p className="px-3 pb-1 text-xs font-semibold uppercase tracking-wide text-pace-muted">Admin</p>}
      <SidebarNavItem
        {...nav}
        href="/dashboard/admin/settings"
        label="Platform settings"
        LucideIcon={Settings}
        active={pathname === "/dashboard/admin/settings"}
      />
      <SidebarNavItem
        {...nav}
        href="/dashboard/admin/study-results"
        label="Study results"
        LucideIcon={BarChart3}
        active={pathname.startsWith("/dashboard/admin/study-results")}
      />
    </nav>
  );
}
