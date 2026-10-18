"use client";

import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { PaceIcon } from "@/components/features/student/shared/pace-icon";
import { SidebarBrand } from "@/components/features/dashboard/sidebar-brand";
import { LogoutConfirmDialog } from "@/components/features/dashboard/logout-confirm-dialog";
import { useSidebarCollapse } from "@/components/features/dashboard/use-sidebar-collapse";
import { SidebarNavItem } from "./sidebar-nav-item";
import { SidebarClasses, type SidebarClass } from "./sidebar-classes";
import { SidebarProfile, type SidebarXp } from "./sidebar-profile";
import { useLogout } from "./use-logout";

type StudentSidebarProps = {
  userEmail: string;
  userName?: string | null;
  classes: SidebarClass[];
  xp?: SidebarXp;
  todoCount: number;
  forceExpanded?: boolean;
  onNavigate?: () => void;
};

export function StudentSidebar({
  userEmail,
  userName,
  classes,
  xp,
  todoCount,
  forceExpanded,
  onNavigate,
}: StudentSidebarProps) {
  const pathname = usePathname();
  const { collapsed: stored, toggleCollapsed } = useSidebarCollapse();
  const collapsed = forceExpanded ? false : stored;
  const logout = useLogout();
  const displayName = userName || userEmail;
  const nav = { collapsed, onNavigate };

  return (
    <aside
      className={cn(
        "flex h-full shrink-0 flex-col bg-white pb-5 pt-6 transition-[width] duration-200 ease-linear",
        forceExpanded ? "w-full" : "border-r border-pace-line",
        !forceExpanded && (collapsed ? "w-20 items-center px-4" : "w-64 px-4"),
        forceExpanded && "px-4",
        collapsed && "gap-1.5",
        !collapsed && "gap-1",
      )}
    >
      <div
        className={cn(
          "flex items-center pb-6",
          collapsed ? "flex-col gap-3.5 pb-5" : "w-full justify-between pl-2.5",
        )}
      >
        <SidebarBrand collapsed={collapsed} className="px-0" />
        {!forceExpanded && (
          <button
            type="button"
            onClick={toggleCollapsed}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            className="flex size-[34px] cursor-pointer items-center justify-center rounded-[10px]"
          >
            <PaceIcon name={collapsed ? "panel-left-open" : "panel-left-close"} size={20} />
          </button>
        )}
      </div>

      <SidebarNavItem
        {...nav}
        href="/dashboard/student"
        label="Home"
        icon="grid-gray"
        activeIcon="grid"
        active={pathname === "/dashboard/student"}
      />
      <SidebarNavItem
        {...nav}
        href="/dashboard/student/todo"
        label="To-do"
        icon="todo"
        activeIcon="todo-white"
        active={pathname === "/dashboard/student/todo"}
        badge={todoCount}
      />
      <SidebarNavItem
        {...nav}
        href="/dashboard/student/archive"
        label="Archive"
        icon="archive"
        active={pathname === "/dashboard/student/archive"}
      />
      <SidebarClasses classes={classes} {...nav} />

      <div className="min-h-4 flex-1" />

      <SidebarProfile name={displayName} xp={xp} collapsed={collapsed} />
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
