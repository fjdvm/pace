import { Button } from "@/components/ui/button";
import { paceButtonBase, paceButtonStyles } from "@/components/features/student/shared/pace-button";
import type { ImportedItem } from "@/lib/ai-import/types";

type Props = {
  fileName: string;
  pages: number | null;
  items: ImportedItem[];
  open: string | null;
  onSelect: (key: string) => void;
  onScanAgain: () => void;
};

export function SourcePanel({ fileName, pages, items, open, onSelect, onScanAgain }: Props) {
  const fromFile = items.filter((i) => i.fromFile);
  return (
    <aside className="hidden w-[420px] shrink-0 md:block">
      <div className="flex flex-col gap-3.5 rounded-[12px] border border-pace-line bg-white p-5">
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-base font-bold tracking-[-.08px]">Source file</h2>
          <span className="text-[11px] font-bold uppercase tracking-[.66px] text-pace-muted">{pages ? `${pages} pages` : "1 file"}</span>
        </div>
        <div className="flex flex-col gap-2.5 rounded-[4px] border border-pace-line p-4">
          <p className="truncate text-[15px] font-bold">{fileName || "No file yet"}</p>
          {fromFile.map((item) => {
            const n = items.indexOf(item) + 1;
            const check = !!item.checkNote;
            return (
              <button key={item.key} type="button" onClick={() => onSelect(item.key)} className={`flex items-start gap-2 rounded-[6px] border p-2 text-left ${check ? "border-pace-amber bg-pace-canvas" : "border-pace-purple bg-pace-purple-tint"} ${open === item.key ? "ring-2 ring-pace-purple/40" : ""}`}>
                <span className={`flex size-5 shrink-0 items-center justify-center rounded-full text-[11px] font-bold text-white ${check ? "bg-pace-amber" : "bg-pace-purple"}`}>{n}</span>
                <span className="line-clamp-3 flex-1 text-[12px] leading-snug">{item.sourceText}</span>
              </button>
            );
          })}
        </div>
        <p className="text-[13px] leading-normal text-pace-muted">Click an item to see where it came from in the file.</p>
        <Button type="button" onClick={onScanAgain} className={`${paceButtonBase} ${paceButtonStyles.secondary} w-fit`}>Scan again</Button>
      </div>
    </aside>
  );
}
