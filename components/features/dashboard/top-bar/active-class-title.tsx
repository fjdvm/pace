"use client";

import Link from "next/link";
import { ClassBreadcrumb } from "./class-breadcrumb";
import { useClassTitleOverride } from "./class-title-context";
import { useActiveClass, type NamedClass } from "./use-active-class";

export function ActiveClassTitle({ classes }: { classes: NamedClass[] }) {
  const active = useActiveClass(classes);
  const override = useClassTitleOverride();
  const current = active ?? override;
  return (
    <>
      <Link href="/dashboard" className="min-w-0 truncate text-xl font-bold leading-tight tracking-[-0.01em] text-pace-ink md:hidden">
        {current?.name ?? "Pace"}
      </Link>
      {current && <ClassBreadcrumb id={current.id} name={current.name} />}
    </>
  );
}
