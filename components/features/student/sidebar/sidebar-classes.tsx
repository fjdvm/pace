import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { PaceIcon } from "@/components/features/student/shared/pace-icon";

export type SidebarClass = {
  id: string;
  name: string;
  archived: boolean;
};

type SidebarClassesProps = {
  classes: SidebarClass[];
  collapsed: boolean;
  onNavigate?: () => void;
};

function classCode(name: string) {
  return name.trim().slice(0, 2).toUpperCase();
}

export function SidebarClasses({ classes, collapsed, onNavigate }: SidebarClassesProps) {
  const pathname = usePathname();
  const active = classes.filter((c) => !c.archived);

  return (
    <>
      {!collapsed && (
        <div className="flex w-full items-center justify-between px-3 pb-2 pt-6">
          <span className="text-[11px] font-bold uppercase leading-snug tracking-[0.06em] text-pace-muted">
            My classes
          </span>
          <Link href="/dashboard/student" aria-label="Join a class" onClick={onNavigate}>
            <PaceIcon name="plus" size={16} />
          </Link>
        </div>
      )}
      {collapsed && (
        <Link
          href="/dashboard/student"
          aria-label="Join a class"
          className="flex size-12 items-center justify-center rounded-xl"
        >
          <PaceIcon name="plus" size={16} />
        </Link>
      )}
      {active.map((cls, index) => {
        const href = `/dashboard/student/classes/${cls.id}`;
        const purple = index % 2 === 1;
        return (
          <Link
            key={cls.id}
            href={href}
            onClick={onNavigate}
            title={collapsed ? cls.name : undefined}
            className={cn(
              "flex items-center rounded-xl",
              collapsed ? "size-12 justify-center" : "w-full gap-2.5 px-3 py-[9px]",
              pathname === href && !collapsed && "bg-pace-sunken",
            )}
          >
            {collapsed ? (
              <span
                className={cn(
                  "flex size-9 items-center justify-center rounded-[10px] text-[11px] font-bold tracking-[0.06em]",
                  purple ? "bg-pace-purple-tint text-pace-purple" : "bg-pace-green-tint text-pace-green-deep",
                )}
              >
                {classCode(cls.name)}
              </span>
            ) : (
              <>
                <PaceIcon name={purple ? "dot-purple" : "dot-green"} size={10} />
                <span className="truncate text-[13px] font-semibold leading-normal text-pace-ink">{cls.name}</span>
              </>
            )}
          </Link>
        );
      })}
    </>
  );
}
