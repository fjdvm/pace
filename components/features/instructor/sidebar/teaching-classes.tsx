"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { PaceIcon } from "@/components/features/student/shared/pace-icon";
import { classTone } from "@/components/features/shared/class-tone";
import { splitClassName } from "@/lib/class-name";
import { CreateClassDialog } from "./create-class-dialog";

export type TeachingClass = { id: string; name: string };

type TeachingClassesProps = {
  classes: TeachingClass[];
  collapsed: boolean;
  onNavigate?: () => void;
};

export function TeachingClasses({ classes, collapsed, onNavigate }: TeachingClassesProps) {
  const pathname = usePathname();
  const [creating, setCreating] = useState(false);

  return (
    <>
      {collapsed ? (
        <button
          type="button"
          aria-label="Create a class"
          onClick={() => setCreating(true)}
          className="flex size-12 cursor-pointer items-center justify-center rounded-xl"
        >
          <PaceIcon name="plus" size={16} />
        </button>
      ) : (
        <div className="flex w-full items-center justify-between px-3 pb-2 pt-6">
          <span className="text-[11px] font-bold uppercase leading-snug tracking-[0.06em] text-pace-muted">Teaching</span>
          <button type="button" aria-label="Create a class" onClick={() => setCreating(true)} className="cursor-pointer">
            <PaceIcon name="plus" size={16} />
          </button>
        </div>
      )}
      {classes.map((cls, index) => {
        const href = `/dashboard/instructor/classes/${cls.id}`;
        const purple = classTone(index) === "purple";
        const { code, description } = splitClassName(cls.name);
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
                {code.slice(0, 2).toUpperCase()}
              </span>
            ) : (
              <>
                <PaceIcon name={purple ? "dot-purple" : "dot-green"} size={10} />
                <span className="flex min-w-0 flex-col">
                  <span className="truncate text-[13px] font-semibold leading-normal text-pace-ink">{code}</span>
                  {description && <span className="truncate text-xs leading-normal text-pace-muted">{description}</span>}
                </span>
              </>
            )}
          </Link>
        );
      })}
      <CreateClassDialog open={creating} onOpenChange={setCreating} />
    </>
  );
}
