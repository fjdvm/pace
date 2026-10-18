"use client";

import { cn } from "@/lib/utils";
import { PaceIcon } from "@/components/features/student/shared/pace-icon";
import { SidebarBrand } from "@/components/features/dashboard/sidebar-brand";
import { LogoutConfirmDialog } from "@/components/features/dashboard/logout-confirm-dialog";
import { useSidebarCollapse } from "@/components/features/dashboard/use-sidebar-collapse";
import { useLogout } from "@/components/features/student/sidebar/use-logout";

type SidebarFrameProps = {
  forceExpanded?: boolean;
  profile: (collapsed: boolean) => React.ReactNode;
  children: (collapsed: boolean) => React.ReactNode;
};

export function SidebarFrame({ forceExpanded, profile, children }: SidebarFrameProps) {
  const { collapsed: stored } = useSidebarCollapse();
  const collapsed = forceExpanded ? false : stored;
  const logout = useLogout();

  return (
    <aside
      className={cn(
        "flex h-full shrink-0 flex-col bg-white pb-5 pt-6 transition-[width] duration-200 ease-linear",
        forceExpanded ? "w-full px-4" : "border-r border-pace-line",
        !forceExpanded && (collapsed ? "w-20 items-center px-4" : "w-64 px-4"),
        collapsed ? "gap-1.5" : "gap-1",
      )}
    >
      <div className={cn("flex items-center pb-6", collapsed ? "justify-center pb-5" : "w-full pl-2.5")}>
        <SidebarBrand collapsed={collapsed} className="px-0" />
      </div>

      {children(collapsed)}

      <div className="min-h-4 flex-1" />

      {profile(collapsed)}
      <button
        type="button"
        onClick={() => logout.setOpen(true)}
        aria-label="Log out"
        className={cn(
          "flex cursor-pointer items-center gap-3 text-[15px] text-pace-ink-2",
          collapsed ? "size-12 justify-center" : "w-full px-3 pt-3",
        )}
      >
        <PaceIcon name="logout" size={18} />
        {!collapsed && <span>Log out</span>}
      </button>

      <LogoutConfirmDialog
        open={logout.open}
        onOpenChange={logout.setOpen}
        onConfirm={logout.confirmLogout}
        isLoggingOut={logout.isLoggingOut}
      />
    </aside>
  );
}
