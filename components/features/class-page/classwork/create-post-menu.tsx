"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MaterialDialog } from "../stream/material-dialog";
import { AnnouncementDialog } from "../stream/announcement-dialog";
import {
  paceButtonBase,
  paceButtonStyles,
} from "@/components/features/student/shared/pace-button";

export function CreatePostMenu({ classId }: { classId: string }) {
  const [material, setMaterial] = useState(false);
  const [announcement, setAnnouncement] = useState(false);
  const row = "gap-3.5 rounded-none py-2.5 pl-4 pr-6 focus:bg-pace-sunken";
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button className={`${paceButtonBase} ${paceButtonStyles.green}`} />
          }
        >
          + Create
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="start"
          sideOffset={8}
          className="w-[300px] max-w-[calc(100vw-32px)] rounded-[8px] border-0 bg-white px-0 py-2 shadow-[0_4px_16px_0_rgba(0,0,0,.16)]"
        >
          <DropdownMenuItem
            className={`${row} bg-pace-purple-tint`}
            render={
              <Link href={`/dashboard/assignments/import?classId=${classId}`} />
            }
          >
            <Image src="/post/folder.svg" alt="" width={24} height={24} />
            <MenuCopy
              title="Import from file"
              subtitle="AI builds it from a PDF, Word or photo"
              purple
            />
          </DropdownMenuItem>
          <DropdownMenuItem
            className={row}
            render={
              <Link href={`/dashboard/assignments/new?classId=${classId}`} />
            }
          >
            <Image
              src="/post/menu-activity.svg"
              alt=""
              width={24}
              height={24}
            />
            <MenuCopy
              title="Activity"
              subtitle="Add coding, quiz or written items"
            />
          </DropdownMenuItem>
          <DropdownMenuItem
            className={row}
            onClick={() => setAnnouncement(true)}
          >
            <Image src="/class/message.svg" alt="" width={24} height={24} />
            <MenuCopy
              title="Announcement"
              subtitle="Post to the class stream"
            />
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setMaterial(true)}
            className={row}
          >
            <Image src="/class/book.svg" alt="" width={24} height={24} />
            <MenuCopy title="Material" subtitle="Notes, slides, or links" />
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <MaterialDialog classId={classId} open={material} onOpenChange={setMaterial} />
      <AnnouncementDialog
        classId={classId}
        open={announcement}
        onOpenChange={setAnnouncement}
      />
    </>
  );
}

function MenuCopy({
  title,
  subtitle,
  purple,
}: {
  title: string;
  subtitle: string;
  purple?: boolean;
}) {
  return (
    <div className="min-w-0">
      <p
        className={`text-[15px] font-bold leading-[1.55] ${purple ? "text-pace-purple" : "text-pace-ink"}`}
      >
        {title}
      </p>
      <p className="text-[13px] leading-normal text-pace-muted">{subtitle}</p>
    </div>
  );
}
