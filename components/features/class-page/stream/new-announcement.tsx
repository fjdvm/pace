"use client";

import { useState } from "react";
import { Pencil } from "lucide-react";
import { AnnouncementDialog } from "./announcement-dialog";

export function NewAnnouncement({ classId }: { classId: string }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex h-12 cursor-pointer items-center gap-3 self-start rounded-full bg-[#c2e7ff] px-6 text-sm font-bold text-[#004a77] hover:brightness-95"
      >
        <Pencil className="size-4" />
        New announcement
      </button>
      <AnnouncementDialog classId={classId} open={open} onOpenChange={setOpen} />
    </>
  );
}
