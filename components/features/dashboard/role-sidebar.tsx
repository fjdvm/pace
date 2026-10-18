"use client";

import { AppSidebar } from "./app-sidebar";
import { StudentSidebar } from "@/components/features/student/sidebar/student-sidebar";

interface SidebarClass {
  id: string;
  name: string;
  archived: boolean;
  classArchived?: boolean;
}

export interface RoleSidebarProps {
  role: "student" | "instructor" | "admin";
  userEmail: string;
  userName?: string | null;
  classes?: SidebarClass[];
  studentXp?: { totalXp: number; level: number; currentXp: number; nextThreshold: number };
  todoCount?: number;
  forceExpanded?: boolean;
  onNavigate?: () => void;
}

export function RoleSidebar({ role, studentXp, todoCount = 0, classes = [], ...rest }: RoleSidebarProps) {
  if (role === "student") {
    return (
      <StudentSidebar
        userEmail={rest.userEmail}
        userName={rest.userName}
        classes={classes}
        xp={studentXp}
        todoCount={todoCount}
        forceExpanded={rest.forceExpanded}
        onNavigate={rest.onNavigate}
      />
    );
  }
  return <AppSidebar role={role} classes={classes} studentXp={studentXp} {...rest} />;
}
