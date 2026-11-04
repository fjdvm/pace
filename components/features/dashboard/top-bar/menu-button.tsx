"use client";

import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/ui/sidebar";

export function MenuButton() {
  const { toggleSidebar } = useSidebar();
  return (
    <Button variant="ghost" size="icon" onClick={toggleSidebar} aria-label="Toggle menu" className="size-10 rounded-full text-pace-ink hover:bg-pace-sunken">
      <Menu className="size-6" strokeWidth={1.5} />
    </Button>
  );
}
