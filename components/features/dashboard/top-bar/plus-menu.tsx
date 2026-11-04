"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { CreateClassDialog } from "@/components/features/instructor/sidebar/create-class-dialog";
import { JoinClassDialog } from "../join-class-dialog";

export function PlusMenu() {
  const [joining, setJoining] = useState(false);
  const [creating, setCreating] = useState(false);
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger
          aria-label="Join or create class"
          className="flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-full text-pace-ink outline-none hover:bg-pace-sunken"
        >
          <Plus className="size-6" strokeWidth={1.5} />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-44">
          <DropdownMenuItem onClick={() => setJoining(true)}>Join class</DropdownMenuItem>
          <DropdownMenuItem onClick={() => setCreating(true)}>Create class</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <JoinClassDialog open={joining} onOpenChange={setJoining} />
      <CreateClassDialog open={creating} onOpenChange={setCreating} />
    </>
  );
}
