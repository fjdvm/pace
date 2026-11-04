"use client";

import { usePathname } from "next/navigation";
import { ChartLine, SlidersHorizontal } from "lucide-react";
import { SidebarMenu } from "@/components/ui/sidebar";
import { SidebarDivider } from "@/components/features/dashboard/sidebar/sidebar-divider";
import { SidebarHeading } from "@/components/features/dashboard/sidebar/sidebar-heading";
import { SidebarNavLink } from "@/components/features/dashboard/sidebar/sidebar-nav-link";

export function AdminSection() {
  const pathname = usePathname();
  return (
    <nav aria-label="Admin" className="mt-auto">
      <SidebarDivider />
      <SidebarHeading>Admin</SidebarHeading>
      <SidebarMenu className="gap-0">
        <SidebarNavLink
          href="/dashboard/admin/settings"
          label="Platform settings"
          icon={SlidersHorizontal}
          active={pathname === "/dashboard/admin/settings"}
        />
        <SidebarNavLink
          href="/dashboard/admin/study-results"
          label="Study results"
          icon={ChartLine}
          active={pathname.startsWith("/dashboard/admin/study-results")}
        />
      </SidebarMenu>
    </nav>
  );
}
