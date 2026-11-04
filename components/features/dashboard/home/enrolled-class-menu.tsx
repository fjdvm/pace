"use client";

import { useState } from "react";
import { EyeOff, LogOut, MoreVertical } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useClassMembershipActions } from "../use-class-membership-actions";
import { UnenrollDialog } from "./unenroll-dialog";

type EnrolledClassMenuProps = {
  id: string;
  name: string;
};

export function EnrolledClassMenu({ id, name }: EnrolledClassMenuProps) {
  const { handleHide, handleLeave } = useClassMembershipActions();
  const [confirming, setConfirming] = useState(false);
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger
          aria-label={`Actions for ${name}`}
          className="absolute right-1 top-1 flex size-10 cursor-pointer items-center justify-center rounded-full text-white outline-none hover:bg-black/15 focus-visible:ring-2 focus-visible:ring-white sm:bottom-1 sm:top-auto sm:text-pace-ink-2 sm:hover:bg-pace-sunken sm:focus-visible:ring-pace-purple"
        >
          <MoreVertical className="size-6" strokeWidth={1.5} />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => handleHide({ id, archived: false })}>
            <EyeOff /> Hide
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setConfirming(true)}>
            <LogOut /> Unenroll
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <UnenrollDialog
        open={confirming}
        name={name}
        onOpenChange={setConfirming}
        onConfirm={() => {
          setConfirming(false);
          handleLeave({ id, archived: false });
        }}
      />
    </>
  );
}
