"use client";

import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { SidebarMenuButton, SidebarMenuItem, useSidebar } from "@/components/ui/sidebar";

type SidebarNavLinkProps = {
  href: string;
  label: string;
  icon: LucideIcon;
  active: boolean;
};

export function SidebarNavLink({ href, label, icon: Icon, active }: SidebarNavLinkProps) {
  const { setOpenMobile } = useSidebar();
  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        render={<Link href={href} onClick={() => setOpenMobile(false)} />}
        isActive={active}
        className={cn(
          "h-12 gap-5 rounded-l-none rounded-r-3xl pl-6 pr-4 text-[15px] leading-[1.55] text-pace-ink hover:bg-pace-sunken [&_svg]:size-6",
          active && "bg-pace-green-tint font-bold text-pace-green-deep hover:bg-pace-green-tint",
        )}
      >
        <Icon strokeWidth={1.5} />
        <span>{label}</span>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}
