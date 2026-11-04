"use client";

import { usePathname } from "next/navigation";
import { SidebarMenu } from "@/components/ui/sidebar";
import { ClassNavLink } from "./class-nav-link";
import { SidebarHeading } from "./sidebar-heading";

type ClassSectionProps = {
  title: string;
  classes: { id: string; name: string }[];
  children?: React.ReactNode;
};

export function ClassSection({ title, classes, children }: ClassSectionProps) {
  const pathname = usePathname();
  return (
    <>
      <SidebarHeading>{title}</SidebarHeading>
      <SidebarMenu className="gap-0">
        {children}
        {classes.map((cls) => (
          <ClassNavLink
            key={cls.id}
            classId={cls.id}
            name={cls.name}
            active={pathname.startsWith(`/dashboard/classes/${cls.id}`)}
          />
        ))}
      </SidebarMenu>
    </>
  );
}
