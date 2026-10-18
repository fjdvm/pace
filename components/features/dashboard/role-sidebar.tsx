"use client";

import { StudentSidebar } from "@/components/features/student/sidebar/student-sidebar";
import { InstructorSidebar } from "@/components/features/instructor/sidebar/instructor-sidebar";
import { AdminSidebar } from "@/components/features/admin/sidebar/admin-sidebar";

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
  navBadge?: number;
  forceExpanded?: boolean;
  onNavigate?: () => void;
}

export function RoleSidebar({ role, studentXp, navBadge = 0, classes = [], ...rest }: RoleSidebarProps) {
  const shared = {
    userEmail: rest.userEmail,
    userName: rest.userName,
    forceExpanded: rest.forceExpanded,
    onNavigate: rest.onNavigate,
  };
  if (role === "student") {
    return <StudentSidebar {...shared} classes={classes} xp={studentXp} todoCount={navBadge} />;
  }
  if (role === "instructor") {
    return <InstructorSidebar {...shared} classes={classes.filter((c) => !c.archived)} submissionCount={navBadge} />;
  }
  return <AdminSidebar {...shared} pendingCount={navBadge} />;
}
