import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { PaceIcon } from "@/components/features/student/shared/pace-icon";
import { PaceTag } from "@/components/features/student/shared/pace-tag";

type SidebarNavItemProps = {
  href: string;
  label: string;
  icon?: string;
  LucideIcon?: LucideIcon;
  activeIcon?: string;
  active: boolean;
  collapsed: boolean;
  badge?: number;
  badgeTone?: "red" | "green" | "amber";
  onNavigate?: () => void;
};

export function SidebarNavItem({
  href,
  label,
  icon,
  LucideIcon: Glyph,
  activeIcon,
  active,
  collapsed,
  badge,
  badgeTone = "red",
  onNavigate,
}: SidebarNavItemProps) {
  const showBadge = badge !== undefined && badge > 0;
  return (
    <Link
      href={href}
      onClick={onNavigate}
      aria-label={label}
      title={collapsed ? label : undefined}
      className={cn(
        "relative flex items-center gap-3 rounded-xl text-[15px]",
        collapsed ? "size-12 justify-center" : "w-full px-3 py-[11px]",
        active ? "bg-pace-ink font-semibold text-white" : "text-pace-ink-2",
        !active && collapsed && showBadge && "bg-pace-sunken",
      )}
    >
      {Glyph ? (
        <Glyph className="size-[18px]" strokeWidth={1.75} />
      ) : (
        <PaceIcon
          name={active && activeIcon ? activeIcon : icon ?? ""}
          size={18}
          className={active && !activeIcon ? "brightness-0 invert" : undefined}
        />
      )}
      {!collapsed && <span>{label}</span>}
      {!collapsed && showBadge && <PaceTag tone={badgeTone} className={cn("ml-auto", active && "bg-white text-pace-ink")}>
          {badge}
        </PaceTag>}
      {collapsed && showBadge && (
        <PaceIcon name="badge-dot" size={9} className="absolute right-2 top-2.5" />
      )}
    </Link>
  );
}
