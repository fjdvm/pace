"use client";

import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { RoleSidebar, type RoleSidebarProps } from "./role-sidebar";
import { useSidebarCollapse } from "./use-sidebar-collapse";

export function MobileSidebarDrawer(props: RoleSidebarProps) {
  const { mobileOpen, setMobileOpen } = useSidebarCollapse();
  return (
    <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
      <SheetContent side="left" className="w-72 p-0">
        <SheetHeader className="sr-only">
          <SheetTitle>Navigation</SheetTitle>
          <SheetDescription>Dashboard navigation menu</SheetDescription>
        </SheetHeader>
        <RoleSidebar {...props} forceExpanded onNavigate={() => setMobileOpen(false)} />
      </SheetContent>
    </Sheet>
  );
}
