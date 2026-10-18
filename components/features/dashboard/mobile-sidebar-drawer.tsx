"use client";

import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { RoleSidebar } from "./role-sidebar";
import { useSidebarCollapse } from "./use-sidebar-collapse";

interface SidebarClass {
  id: string;
  name: string;
  archived: boolean;
  classArchived?: boolean;
}

interface MobileSidebarDrawerProps {
  role: "student" | "instructor" | "admin";
  userEmail: string;
  userName?: string | null;
  classes?: SidebarClass[];
  studentXp?: { totalXp: number; level: number; currentXp: number; nextThreshold: number };
  todoCount?: number;
}

export function MobileSidebarDrawer({ role, userEmail, userName, classes, studentXp, todoCount }: MobileSidebarDrawerProps) {
  const { mobileOpen, setMobileOpen } = useSidebarCollapse();

  return (
    <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
      <SheetContent side="left" className="w-72 p-0">
        <SheetHeader className="sr-only">
          <SheetTitle>Navigation</SheetTitle>
          <SheetDescription>Dashboard navigation menu</SheetDescription>
        </SheetHeader>
        <RoleSidebar
          role={role}
          userEmail={userEmail}
          userName={userName}
          classes={classes}
          studentXp={studentXp}
          todoCount={todoCount}
          forceExpanded
          onNavigate={() => setMobileOpen(false)}
        />
      </SheetContent>
    </Sheet>
  );
}
