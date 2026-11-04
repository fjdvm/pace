"use client";

import { AdminSection } from "@/components/features/admin/sidebar/admin-section";
import { usePathname } from "next/navigation";
import { SidebarFrame } from "@/components/features/dashboard/sidebar/sidebar-frame";
import { SidebarNavItem } from "./sidebar-nav-item";
import { SidebarClasses, type SidebarClass } from "./sidebar-classes";
import { SidebarProfile, type SidebarXp } from "./sidebar-profile";

type StudentSidebarProps = {
  userEmail: string;
  isAdmin?: boolean;
  userName?: string | null;
  classes: SidebarClass[];
  xp?: SidebarXp;
  todoCount: number;
  forceExpanded?: boolean;
  onNavigate?: () => void;
};

export function StudentSidebar({
  userEmail,
  isAdmin = false,
  userName,
  classes,
  xp,
  todoCount,
  forceExpanded,
  onNavigate,
}: StudentSidebarProps) {
  const pathname = usePathname();
  const displayName = userName || userEmail;

  return (
    <SidebarFrame
      forceExpanded={forceExpanded}
      profile={(collapsed) => <SidebarProfile name={displayName} xp={xp} collapsed={collapsed} />}
    >
      {(collapsed) => {
        const nav = { collapsed, onNavigate };
        return (
          <>
            <SidebarNavItem
              {...nav}
              href="/dashboard"
              label="Home"
              icon="grid-gray"
              activeIcon="grid"
              active={pathname === "/dashboard"}
            />
            <SidebarNavItem
              {...nav}
              href="/dashboard/todo"
              label="To-do"
              icon="todo"
              activeIcon="todo-white"
              active={pathname === "/dashboard/todo"}
              badge={todoCount}
            />
            <SidebarNavItem
              {...nav}
              href="/dashboard/enrolled/archive"
              label="Archive"
              icon="archive"
              active={pathname === "/dashboard/enrolled/archive"}
            />
            <SidebarClasses classes={classes} {...nav} />
            {isAdmin && <AdminSection {...nav} />}
          </>
        );
      }}
    </SidebarFrame>
  );
}
