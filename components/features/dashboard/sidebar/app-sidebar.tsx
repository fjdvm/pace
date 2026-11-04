"use client";

import { usePathname } from "next/navigation";
import { Archive, ClipboardCheck, House } from "lucide-react";
import { Sidebar, SidebarContent, SidebarMenu, useSidebar } from "@/components/ui/sidebar";
import { AdminSection } from "@/components/features/admin/sidebar/admin-section";
import { Wordmark } from "@/components/features/landing/shared/wordmark";
import type { DashboardClasses } from "@/lib/dashboard-classes";
import { ClassSection } from "./class-section";
import { SidebarDivider } from "./sidebar-divider";
import { SidebarNavLink } from "./sidebar-nav-link";

type AppSidebarProps = DashboardClasses & { isAdmin: boolean };

export function AppSidebar({ teaching, enrolled, isAdmin }: AppSidebarProps) {
  const pathname = usePathname();
  const { isMobile } = useSidebar();
  const activeTeaching = teaching.filter((cls) => !cls.archived);
  const activeEnrolled = enrolled.filter((cls) => !cls.archived);

  return (
    <Sidebar className="top-16 h-[calc(100svh-4rem)]">
      <SidebarContent className="gap-0 py-2 pr-2 md:pt-2">
        {isMobile && <Wordmark className="pb-3 pl-6 pt-11" />}
        <SidebarMenu className="gap-0">
          <SidebarNavLink href="/dashboard" label="Home" icon={House} active={pathname === "/dashboard"} />
          {activeEnrolled.length > 0 && (
            <SidebarNavLink href="/dashboard/todo" label="To-do" icon={ClipboardCheck} active={pathname === "/dashboard/todo"} />
          )}
        </SidebarMenu>
        {activeTeaching.length > 0 && (
          <>
            <SidebarDivider />
            <ClassSection title="Teaching" classes={activeTeaching}>
              <SidebarNavLink
                href="/dashboard/submissions"
                label="To review"
                icon={ClipboardCheck}
                active={pathname.startsWith("/dashboard/submissions")}
              />
            </ClassSection>
          </>
        )}
        {activeEnrolled.length > 0 && (
          <>
            <SidebarDivider />
            <ClassSection title="Enrolled" classes={activeEnrolled} />
          </>
        )}
        <SidebarDivider />
        <SidebarMenu className="gap-0">
          <SidebarNavLink href="/dashboard/archive" label="Archived classes" icon={Archive} active={pathname === "/dashboard/archive"} />
        </SidebarMenu>
        {isAdmin && <AdminSection />}
      </SidebarContent>
    </Sidebar>
  );
}
