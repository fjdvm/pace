"use client";

import { usePathname } from "next/navigation";
import { GraduationCap } from "lucide-react";
import { AdminSection } from "@/components/features/admin/sidebar/admin-section";
import { SidebarFrame } from "./sidebar/sidebar-frame";
import { SidebarNavItem } from "@/components/features/student/sidebar/sidebar-nav-item";
import { SidebarProfile } from "@/components/features/student/sidebar/sidebar-profile";
import { TeachingClasses } from "@/components/features/instructor/sidebar/teaching-classes";
import { SidebarClasses } from "@/components/features/student/sidebar/sidebar-classes";
import type { DashboardClasses } from "@/lib/dashboard-classes";

export interface RoleSidebarProps extends DashboardClasses {
  studentXp: { level: number; currentXp: number; nextThreshold: number };
  isAdmin: boolean;
  userEmail: string;
  userName?: string | null;
  forceExpanded?: boolean;
  onNavigate?: () => void;
}

export function RoleSidebar({ teaching, enrolled, studentXp, isAdmin, userEmail, userName, forceExpanded, onNavigate }: RoleSidebarProps) {
  const pathname = usePathname();
  return (
    <SidebarFrame forceExpanded={forceExpanded} profile={(collapsed) => (
      <SidebarProfile name={userName || userEmail} roleLabel="User" xp={studentXp} tone="purple" collapsed={collapsed} />
    )}>
      {(collapsed) => {
        const nav = { collapsed, onNavigate };
        return <>
          <SidebarNavItem {...nav} href="/dashboard" label="Home" icon="grid-gray" activeIcon="grid" active={pathname === "/dashboard"} />
          <SidebarNavItem {...nav} href="/dashboard/student/todo" label="To-do" icon="grid-gray" active={pathname === "/dashboard/student/todo"} />
          <SidebarNavItem {...nav} href="/dashboard/student/archive" label="Enrolled archive" icon="archive" active={pathname === "/dashboard/student/archive"} />
          {teaching.length > 0 && <>
            <SidebarNavItem {...nav} href="/dashboard/instructor/submissions" label="Submissions" LucideIcon={GraduationCap} active={pathname.startsWith("/dashboard/instructor/submissions")} />
            <SidebarNavItem {...nav} href="/dashboard/instructor/archive" label="Teaching archive" icon="archive" active={pathname === "/dashboard/instructor/archive"} />
          </>}
          <TeachingClasses classes={teaching.filter((cls) => !cls.archived)} {...nav} />
          <SidebarClasses classes={enrolled} {...nav} />
          {isAdmin && <AdminSection {...nav} />}
        </>;
      }}
    </SidebarFrame>
  );
}
