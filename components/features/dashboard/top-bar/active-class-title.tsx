"use client";

import Link from "next/link";
import { ClassBreadcrumb } from "./class-breadcrumb";
import { useActiveClass, type NamedClass } from "./use-active-class";

export function ActiveClassTitle({ classes }: { classes: NamedClass[] }) {
  const active = useActiveClass(classes);
  return (
    <>
      <Link href="/dashboard" className="min-w-0 truncate text-xl font-bold leading-tight tracking-[-0.01em] text-pace-ink md:hidden">
        {active?.name ?? "Pace"}
      </Link>
      {active && <ClassBreadcrumb name={active.name} />}
    </>
  );
}
