"use client";

import { MoreVertical } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import type { TeachingHomeClass } from "@/app/actions/teaching-home";

export function TeachingClassMenu({ cls }: { cls: TeachingHomeClass }) {
  async function copyCode() {
    try {
      await navigator.clipboard.writeText(cls.joinCode);
      toast.success("Join code copied");
    } catch {
      toast.error("Could not copy the code");
    }
  }
  return (
    <DropdownMenu>
      <DropdownMenuTrigger aria-label={`Actions for ${cls.name}`} className="absolute right-1 top-1 flex size-10 cursor-pointer items-center justify-center rounded-full text-white outline-none hover:bg-black/15 focus-visible:ring-2 focus-visible:ring-white sm:bottom-1 sm:top-auto sm:text-pace-ink-2 sm:hover:bg-pace-sunken sm:focus-visible:ring-pace-purple">
        <MoreVertical className="size-6" strokeWidth={1.5} />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem render={<Link href={cls.reviews[0] ? `/dashboard/submissions/${cls.reviews[0].assignmentId}` : "/dashboard/submissions"} />}>To review</DropdownMenuItem>
        <DropdownMenuItem onClick={copyCode}>Copy join code {cls.joinCode}</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
