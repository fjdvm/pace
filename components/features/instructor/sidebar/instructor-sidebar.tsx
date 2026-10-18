"use client";

import { usePathname } from "next/navigation";
import { GraduationCap } from "lucide-react";
import { SidebarFrame } from "@/components/features/dashboard/sidebar/sidebar-frame";
import { SidebarNavItem } from "@/components/features/student/sidebar/sidebar-nav-item";
import { SidebarProfile } from "@/components/features/student/sidebar/sidebar-profile";
import { instructorTitle } from "@/lib/instructor-name";
import { TeachingClasses, type TeachingClass } from "./teaching-classes";

type InstructorSidebarProps = {
  userEmail: string;
  userName?: string | null;
  classes: TeachingClass[];
  submissionCount: number;
  forceExpanded?: boolean;
  onNavigate?: () => void;
};

export function InstructorSidebar({
  userEmail,
  userName,
  classes,
  submissionCount,
  forceExpanded,
  onNavigate,
}: InstructorSidebarProps) {
  const pathname = usePathname();
  const name = instructorTitle({ name: userName, email: userEmail });

  return (
    <SidebarFrame
      forceExpanded={forceExpanded}
      profile={(collapsed) => (
        <SidebarProfile name={name} roleLabel="Instructor" tone="purple" collapsed={collapsed} />
      )}
    >
      {(collapsed) => {
        const nav = { collapsed, onNavigate };
        return (
          <>
            <SidebarNavItem
              {...nav}
              href="/dashboard/instructor"
              label="Home"
              icon="grid-gray"
              activeIcon="grid"
              active={pathname === "/dashboard/instructor"}
            />
            <SidebarNavItem
              {...nav}
              href="/dashboard/instructor/submissions"
              label="Submissions"
              LucideIcon={GraduationCap}
              active={pathname.startsWith("/dashboard/instructor/submissions")}
              badge={submissionCount}
              badgeTone="green"
            />
            <SidebarNavItem
              {...nav}
              href="/dashboard/instructor/archive"
              label="Archive"
              icon="archive"
              active={pathname === "/dashboard/instructor/archive"}
            />
            <TeachingClasses classes={classes} {...nav} />
          </>
        );
      }}
    </SidebarFrame>
  );
}
