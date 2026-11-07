"use client";

import Image from "next/image";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CreateClassDialog } from "@/components/features/instructor/sidebar/create-class-dialog";

export function CreateClassButton() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button aria-label="Create class" onClick={() => setOpen(true)} className="fixed bottom-7 right-6 z-10 size-14 rounded-[16px] bg-pace-green p-0 shadow-[0_4px_12px_rgba(0,0,0,0.18)] hover:bg-pace-green-deep sm:hidden">
        <Image src="/instructor-home/plus.svg" alt="" width={24} height={24} />
      </Button>
      <CreateClassDialog open={open} onOpenChange={setOpen} />
    </>
  );
}
