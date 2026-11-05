"use client";

import { usePathname } from "next/navigation";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import type { DashboardClasses } from "@/lib/dashboard-classes";
import { AppSidebar } from "./sidebar/app-sidebar";
import { ClassTitleProvider } from "./top-bar/class-title-context";
import { TopBar } from "./top-bar/top-bar";

type DashboardShellProps = DashboardClasses & {
  isAdmin: boolean;
  userEmail: string;
  userName?: string | null;
  studentXp: { level: number; currentXp: number; nextThreshold: number };
  children: React.ReactNode;
};

export function DashboardShell({ children, teaching, enrolled, isAdmin, userEmail, userName, studentXp }: DashboardShellProps) {
  const pathname = usePathname();
  if (/^\/dashboard\/submissions\/[^/]+\/[^/]+$/.test(pathname) && !pathname.endsWith("/compare")) return <>{children}</>;
  if (/^\/dashboard\/assignments\/(new|[^/]+\/(edit|work))$/.test(pathname)) return <>{children}</>;

  return (
    <SidebarProvider className="h-svh min-h-0 flex-col overflow-hidden bg-pace-canvas">
      <ClassTitleProvider>
        <TopBar classes={[...teaching, ...enrolled]} userEmail={userEmail} userName={userName} isInstructor={teaching.length > 0 && enrolled.length === 0} studentXp={studentXp} />
        <div className="flex min-h-0 flex-1">
          <AppSidebar teaching={teaching} enrolled={enrolled} isAdmin={isAdmin} />
          <SidebarInset className="min-w-0 overflow-y-auto bg-pace-canvas">{children}</SidebarInset>
        </div>
      </ClassTitleProvider>
    </SidebarProvider>
  );
}
