"use client";
import { useRef, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { paceButtonBase, paceButtonStyles } from "@/components/features/student/shared/pace-button";

const ACCEPT = ".pdf,.docx,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png";

export function FileDropZone({ onFile }: { onFile: (file: File) => void }) {
  const browse = useRef<HTMLInputElement>(null);
  const camera = useRef<HTMLInputElement>(null);
  const [over, setOver] = useState(false);
  const pick = (files: FileList | null) => {
    if (files?.[0]) onFile(files[0]);
  };
  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setOver(true); }}
      onDragLeave={() => setOver(false)}
      onDrop={(e) => { e.preventDefault(); setOver(false); pick(e.dataTransfer.files); }}
      className={`flex flex-col items-center gap-2 rounded-[12px] border border-dashed p-7 text-center ${over ? "border-pace-purple bg-pace-purple-tint" : "border-pace-line-strong bg-pace-canvas"}`}
    >
      <span className="flex size-14 items-center justify-center rounded-full bg-pace-purple-tint">
        <Image src="/post/folder.svg" alt="" width={24} height={24} />
      </span>
      <p className="text-base font-bold tracking-[-.08px]">Drag a file here, or browse</p>
      <p className="text-[13px] text-pace-muted">PDF, Word (.docx), JPG or PNG · up to 20 MB</p>
      <p className="text-[13px] text-pace-muted">Photos of printed or handwritten sheets work too</p>
      <div className="flex gap-2 pt-1.5">
        <Button type="button" onClick={() => browse.current?.click()} className={`${paceButtonBase} ${paceButtonStyles.secondary}`}>Browse files</Button>
        <Button type="button" variant="ghost" onClick={() => camera.current?.click()} className={`${paceButtonBase} ${paceButtonStyles.ghost}`}>Take a photo</Button>
      </div>
      <input ref={browse} type="file" accept={ACCEPT} hidden aria-label="Browse files" onChange={(e) => { pick(e.target.files); e.target.value = ""; }} />
      <input ref={camera} type="file" accept="image/*" capture="environment" hidden aria-label="Take a photo" onChange={(e) => { pick(e.target.files); e.target.value = ""; }} />
    </div>
  );
}
