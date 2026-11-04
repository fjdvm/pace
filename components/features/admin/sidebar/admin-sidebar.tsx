"use client";

import { usePathname } from "next/navigation";
import { BarChart3, Settings } from "lucide-react";
import { SidebarFrame } from "@/components/features/dashboard/sidebar/sidebar-frame";
import { SidebarNavItem } from "@/components/features/student/sidebar/sidebar-nav-item";
import { SidebarProfile } from "@/components/features/student/sidebar/sidebar-profile";

type AdminSidebarProps = {
  userEmail: string;
  userName?: string | null;
  forceExpanded?: boolean;
  onNavigate?: () => void;
};

export function AdminSidebar({ userEmail, userName, forceExpanded, onNavigate }: AdminSidebarProps) {
  const pathname = usePathname();

  return (
    <SidebarFrame
      forceExpanded={forceExpanded}
      profile={(collapsed) => (
        <SidebarProfile
          name={userName || "Admin"}
          roleLabel={userEmail}
          tone="blue"
          collapsed={collapsed}
        />
      )}
    >
      {(collapsed) => {
        const nav = { collapsed, onNavigate };
        return (
          <>
            <SidebarNavItem
              {...nav}
              href="/dashboard/admin"
              label="Overview"
              icon="grid-gray"
              activeIcon="grid"
              active={pathname === "/dashboard/admin"}
            />
            <SidebarNavItem
              {...nav}
              href="/dashboard/admin/study-results"
              label="Study results"
              LucideIcon={BarChart3}
              active={pathname.startsWith("/dashboard/admin/study-results")}
            />
            <SidebarNavItem
              {...nav}
              href="/dashboard/admin/settings"
              label="Settings"
              LucideIcon={Settings}
              active={pathname === "/dashboard/admin/settings"}
            />
          </>
        );
      }}
    </SidebarFrame>
  );
}
