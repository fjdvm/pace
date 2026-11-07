"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ExternalLink, Trash2 } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { DeletePostDialog } from "@/components/features/classes/delete-post-dialog";

export function RowMenu({ href, onDelete, entryName }: { href: string; onDelete?: () => void; entryName?: string }) {
  const [confirming, setConfirming] = useState(false);
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger aria-label="Post actions" className="flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-full outline-none hover:bg-pace-sunken">
          <Image src="/class/more.svg" alt="" width={24} height={24} />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem render={<Link href={href} />}>
            <ExternalLink /> Open
          </DropdownMenuItem>
          {onDelete && (
            <DropdownMenuItem onClick={() => setConfirming(true)}>
              <Trash2 /> Delete
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
      <DeletePostDialog
        entryName={entryName}
        open={confirming}
        onOpenChange={setConfirming}
        onConfirm={() => {
          setConfirming(false);
          onDelete?.();
        }}
      />
    </>
  );
}
