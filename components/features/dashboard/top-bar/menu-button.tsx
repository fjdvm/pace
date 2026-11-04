"use client";

import { Menu } from "lucide-react";
import { useSidebar } from "@/components/ui/sidebar";

export function MenuButton() {
  const { toggleSidebar } = useSidebar();
  return (
    <button
      type="button"
      onClick={toggleSidebar}
      aria-label="Toggle menu"
      className="flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-full text-pace-ink hover:bg-pace-sunken"
    >
      <Menu className="size-6" strokeWidth={1.5} />
    </button>
  );
}
