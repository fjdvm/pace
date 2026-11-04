"use client";

import { usePathname } from "next/navigation";

export type NamedClass = { id: string; name: string };

export function useActiveClass(classes: NamedClass[]) {
  const pathname = usePathname();
  const id = pathname.match(/^\/dashboard\/classes\/([^/]+)/)?.[1];
  return classes.find((cls) => cls.id === id) ?? null;
}
