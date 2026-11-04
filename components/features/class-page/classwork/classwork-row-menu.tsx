"use client";

import Link from "next/link";
import Image from "next/image";
import { Pencil, Trash2 } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

type ClassworkRowMenuProps = {
  assignmentId: string;
  onDelete: () => void;
};

export function ClassworkRowMenu({ assignmentId, onDelete }: ClassworkRowMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label="Post actions"
        className="relative z-10 flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-full outline-none hover:bg-pace-sunken"
      >
        <Image src="/class/more.svg" alt="" width={24} height={24} />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem render={<Link href={`/dashboard/assignments/${assignmentId}/edit`} />}>
          <Pencil /> Edit
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onDelete}>
          <Trash2 /> Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
