"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { SidebarMenuButton, SidebarMenuItem, useSidebar } from "@/components/ui/sidebar";
import { ClassDot } from "../class-dot";

type ClassNavLinkProps = {
  classId: string;
  name: string;
  active: boolean;
};

export function ClassNavLink({ classId, name, active }: ClassNavLinkProps) {
  const { setOpenMobile } = useSidebar();
  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        render={<Link href={`/dashboard/classes/${classId}`} onClick={() => setOpenMobile(false)} />}
        isActive={active}
        className={cn(
          "h-14 gap-4 rounded-l-none rounded-r-[28px] pl-5 pr-4 text-[15px] leading-[1.55] text-pace-ink hover:bg-pace-sunken",
          active && "bg-pace-green-tint font-bold text-pace-green-deep hover:bg-pace-green-tint",
        )}
      >
        <ClassDot classId={classId} name={name} />
        <span className="truncate">{name}</span>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}
