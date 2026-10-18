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
  todoCount?: number;
  children: React.ReactNode;
}

export function DashboardShell({ role, userEmail, userName, classes, studentXp, todoCount, children }: DashboardShellProps) {
  return (
    <SidebarCollapseProvider>
      <div className={`flex h-screen w-full overflow-hidden text-on-surface ${role === "student" ? "bg-pace-canvas" : "bg-surface"}`}>
        {/* Sidebar (desktop) */}
        <div className="hidden md:block shrink-0 h-full">
          <RoleSidebar role={role} userEmail={userEmail} userName={userName} classes={classes} studentXp={studentXp} todoCount={todoCount} />
        </div>

        {/* Sidebar (mobile drawer) */}
        <MobileSidebarDrawer role={role} userEmail={userEmail} userName={userName} classes={classes} studentXp={studentXp} todoCount={todoCount} />

        {/* Content wrapper */}
        <div className={`flex-1 flex flex-col min-w-0 h-full overflow-y-auto ${role === "student" ? "bg-pace-canvas" : "bg-surface"}`}>
          {children}
        </div>
      </div>
    </SidebarCollapseProvider>
  );
}
