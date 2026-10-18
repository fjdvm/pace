"use client";

import { RoleSidebar } from "./role-sidebar";
import { MobileSidebarDrawer } from "./mobile-sidebar-drawer";
import { SidebarCollapseProvider } from "./sidebar-collapse-provider";

interface SidebarClass {
  id: string;
  name: string;
  archived: boolean;
  classArchived?: boolean;
}

interface DashboardShellProps {
  role: "student" | "instructor" | "admin";
  userEmail: string;
  userName?: string | null;
  classes?: SidebarClass[];
  studentXp?: { totalXp: number; level: number; currentXp: number; nextThreshold: number };
  navBadge?: number;
  children: React.ReactNode;
}

export function DashboardShell({ role, userEmail, userName, classes, studentXp, navBadge, children }: DashboardShellProps) {
  const sidebar = { role, userEmail, userName, classes, studentXp, navBadge };
  return (
    <SidebarCollapseProvider>
      <div className="flex h-screen w-full overflow-hidden bg-pace-canvas text-on-surface">
        <div className="hidden h-full shrink-0 md:block">
          <RoleSidebar {...sidebar} />
        </div>
        <MobileSidebarDrawer {...sidebar} />
        <div className="flex h-full min-w-0 flex-1 flex-col overflow-y-auto bg-pace-canvas">{children}</div>
      </div>
    </SidebarCollapseProvider>
  );
}
