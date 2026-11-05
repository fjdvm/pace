import Link from "next/link";
import { Button } from "@/components/ui/button";
import { paceButtonBase, paceButtonStyles } from "@/components/features/student/shared/pace-button";

type Props = { className: string; fileName: string; busy: boolean; backHref: string; onSave: () => void; onAssign: () => void };

export function ReviewHeader({ className, fileName, busy, backHref, onSave, onAssign }: Props) {
  return (
    <header className="flex items-center gap-3 border-b border-pace-line bg-white py-3 pl-4 pr-4 md:pr-6">
      <Link href={backHref} aria-label="Close import" className="flex size-10 items-center justify-center rounded-full text-base font-bold text-pace-ink-2">✕</Link>
      <span className="hidden size-9 items-center justify-center rounded-full bg-pace-green-tint text-[11px] font-bold text-pace-green-deep md:flex">{"</>"}</span>
      <div className="min-w-0 flex-1">
        <h1 className="text-base font-bold leading-[1.35] tracking-[-.08px]">Activity</h1>
        <p className="truncate text-[11px] font-bold uppercase tracking-[.66px] text-pace-muted">{className} · Draft{fileName ? ` · From ${fileName}` : ""}</p>
      </div>
      <Button type="button" disabled={busy} onClick={onSave} className={`${paceButtonBase} ${paceButtonStyles.secondary}`}>Save draft</Button>
      <Button type="button" disabled={busy} onClick={onAssign} className={`${paceButtonBase} ${paceButtonStyles.green}`}>Assign</Button>
    </header>
  );
}
