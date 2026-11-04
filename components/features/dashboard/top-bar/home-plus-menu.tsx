"use client";

import { usePathname } from "next/navigation";
import { PlusMenu } from "./plus-menu";

export function HomePlusMenu() {
  return usePathname() === "/dashboard" ? <PlusMenu /> : null;
}
