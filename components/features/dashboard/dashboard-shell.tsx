"use client";

import { RoleSidebar, type RoleSidebarProps } from "./role-sidebar";
import { MobileSidebarDrawer } from "./mobile-sidebar-drawer";
import { SidebarCollapseProvider } from "./sidebar-collapse-provider";

type DashboardShellProps = RoleSidebarProps & { children: React.ReactNode };

export function DashboardShell({ children, ...sidebar }: DashboardShellProps) {
  return (
    <SidebarCollapseProvider>
      <div className="flex h-screen w-full overflow-hidden bg-pace-canvas text-on-surface">
        <div className="hidden h-full shrink-0 md:block"><RoleSidebar {...sidebar} /></div>
        <MobileSidebarDrawer {...sidebar} />
        <div className="flex h-full min-w-0 flex-1 flex-col overflow-y-auto bg-pace-canvas">{children}</div>
      </div>
    </SidebarCollapseProvider>
  );
}
