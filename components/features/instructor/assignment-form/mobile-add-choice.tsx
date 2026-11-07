"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

type Kind = "coding" | "multiple_choice" | "short_answer";
const choices: { kind: Kind; icon: string; title: string; hint: string }[] = [
  { kind: "coding", icon: "</>", title: "Coding item", hint: "Editor and test cases" },
  { kind: "multiple_choice", icon: "◉", title: "Multiple choice", hint: "One correct answer" },
  { kind: "short_answer", icon: "Aa", title: "Short answer", hint: "Typed answer" },
];
const row = "flex w-full items-center gap-3 rounded-[12px] border border-pace-line p-3.5 text-left";
const iconStyle = "flex size-10 shrink-0 items-center justify-center rounded-full text-[13px] font-bold";

export function MobileAddChoice({ disabled, classId, onAdd, onOpen }: {
  disabled: boolean; classId?: string; onAdd: (kind: Kind) => void; onOpen?: () => void;
}) {
  const [open, setOpen] = useState(false);
  const href = `/dashboard/assignments/import?classId=${classId ?? ""}`;
  return (
    <Sheet open={open} onOpenChange={(next) => { setOpen(next); if (next) onOpen?.(); }}>
      <SheetTrigger render={<Button variant="outline" disabled={disabled} className="h-10 rounded-full bg-white px-[18px] shadow-[0_3px_0_#d6d3cb]" />}>+ Add item</SheetTrigger>
      <SheetContent side="bottom" showCloseButton={false} className="bg-white max-h-[95svh] gap-3.5 overflow-y-auto rounded-t-[20px] px-5 pb-8 pt-3">
        <div aria-hidden className="mx-auto h-1 w-10 rounded-full bg-pace-line-strong" />
        <SheetHeader className="gap-1 p-0">
          <SheetTitle className="text-[22px] font-bold">Add items</SheetTitle>
          <SheetDescription className="text-[13px]">Write them yourself, or let the AI read your activity sheet.</SheetDescription>
        </SheetHeader>
        <p className="text-[11px] font-bold uppercase tracking-[.66px] text-pace-purple">With AI</p>
        {[{ icon: "◎", title: "Take a photo", hint: "Snap the printed sheet" }, { icon: "▤", title: "Choose a file", hint: "PDF, Word, JPG or PNG" }].map((choice) => (
          <Link key={choice.title} href={href} className={row}>
            <span aria-hidden className={`${iconStyle} bg-pace-purple-tint text-pace-purple`}>{choice.icon}</span>
            <span className="min-w-0 flex-1"><b className="block text-[15px]">{choice.title}</b><span className="text-[13px] text-pace-muted">{choice.hint}</span></span>
            <span aria-hidden className="text-pace-muted">›</span>
          </Link>
        ))}
        <p className="text-[11px] font-bold uppercase tracking-[.66px] text-pace-muted">Manually</p>
        <div role="menu" aria-label="Manual item types" className="space-y-3.5">
          {choices.map((choice) => (
            <button key={choice.kind} role="menuitem" type="button" className={row} onClick={() => { setOpen(false); onAdd(choice.kind); }}>
              <span aria-hidden className={`${iconStyle} bg-pace-green-tint text-pace-green`}>{choice.icon}</span>
              <span className="flex-1"><b className="block text-[15px]">{choice.title}</b><span className="text-[13px] text-pace-muted">{choice.hint}</span></span>
              <span aria-hidden className="text-pace-muted">›</span>
            </button>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
}
