"use client";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useMediaQuery } from "@/hooks/use-media-query";
import { paceButtonBase, paceButtonStyles } from "@/components/features/student/shared/pace-button";
import type { ImportKind } from "@/lib/ai-import/types";

const MANUAL: { kind: ImportKind; title: string; hint: string; icon: string }[] = [
  { kind: "coding", title: "Coding", hint: "Editor, test cases, AI tutor", icon: "</>" },
  { kind: "multiple_choice", title: "Multiple choice", hint: "Options with one correct answer", icon: "◉" },
  { kind: "short_answer", title: "Short answer", hint: "Typed answer, graded by you", icon: "Aa" },
];

type Props = { onAdd: (kind: ImportKind) => void; onImport: () => void };

function Row({ icon, title, hint, purple, onClick }: { icon: string; title: string; hint: string; purple?: boolean; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className="flex w-full items-center gap-3 rounded-[8px] p-2.5 text-left hover:bg-pace-sunken">
      <span className={`flex size-8 shrink-0 items-center justify-center rounded-full text-[11px] font-bold ${purple ? "bg-pace-purple-tint text-pace-purple" : "bg-pace-green-tint text-pace-green"}`}>{icon}</span>
      <span><b className="block text-[15px]">{title}</b><span className="text-[13px] text-pace-muted">{hint}</span></span>
    </button>
  );
}

export function AddItemMenu({ onAdd, onImport }: Props) {
  const desktop = useMediaQuery("(min-width: 768px)");
  const trigger = <Button variant="outline" className={`${paceButtonBase} ${paceButtonStyles.secondary}`} />;
  return (
    <div className="flex flex-wrap items-center justify-center gap-3 rounded-[12px] border border-dashed border-pace-line-strong p-4">
      {desktop ? (
        <>
          <DropdownMenu>
            <DropdownMenuTrigger render={trigger}>+ Add item</DropdownMenuTrigger>
            <DropdownMenuContent className="w-80 rounded-[12px] p-1.5">
              {MANUAL.map((m) => (
                <DropdownMenuItem key={m.kind} onClick={() => onAdd(m.kind)} className="gap-3 rounded-[8px] p-2.5">
                  <span className="flex size-8 items-center justify-center rounded-full bg-pace-green-tint text-[11px] font-bold text-pace-green">{m.icon}</span>
                  <span><b className="block text-[15px]">{m.title}</b><span className="text-[13px] text-pace-muted">{m.hint}</span></span>
                </DropdownMenuItem>
              ))}
              <DropdownMenuItem onClick={onImport} className="gap-3 rounded-[8px] p-2.5">
                <span className="flex size-8 items-center justify-center rounded-full bg-pace-purple-tint text-pace-purple">✦</span>
                <span><b className="block text-[15px]">Import from a file</b><span className="text-[13px] text-pace-muted">AI adds items from a PDF, Word or photo</span></span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <span className="text-[13px] text-pace-muted">or</span>
          <button type="button" onClick={onImport} className="flex items-center gap-2 rounded-full bg-pace-purple-tint px-2.5 py-2 text-[13px] font-bold text-pace-purple"><Image src="/post/folder.svg" alt="" width={24} height={24} />Import items from a file</button>
        </>
      ) : (
        <Sheet>
          <SheetTrigger render={trigger}>+ Add item</SheetTrigger>
          <SheetContent side="bottom" className="rounded-t-[20px] px-5 pb-6">
            <SheetHeader className="p-0 pt-4">
              <SheetTitle className="text-[22px] font-bold">Add items</SheetTitle>
              <SheetDescription>Write them yourself, or let the AI read your activity sheet.</SheetDescription>
            </SheetHeader>
            <p className="text-[11px] font-bold uppercase tracking-[.66px] text-pace-purple">With AI</p>
            <Row purple icon="◎" title="Take a photo" hint="Snap the printed sheet" onClick={onImport} />
            <Row purple icon="▤" title="Choose a file" hint="PDF, Word, JPG or PNG" onClick={onImport} />
            <p className="text-[11px] font-bold uppercase tracking-[.66px] text-pace-muted">Manually</p>
            {MANUAL.map((m) => <Row key={m.kind} icon={m.icon} title={`${m.title}${m.kind === "coding" ? " item" : ""}`} hint={m.hint} onClick={() => onAdd(m.kind)} />)}
          </SheetContent>
        </Sheet>
      )}
    </div>
  );
}
