import { Button } from "@/components/ui/button";
import { paceButtonBase, paceButtonStyles } from "@/components/features/student/shared/pace-button";

export function CheckNote({ note, onConfirm }: { note: string; onConfirm: () => void }) {
  return (
    <div className="flex items-center gap-2.5 rounded-[8px] bg-pace-canvas p-3">
      <span className="text-[15px] font-bold text-pace-amber">⚠</span>
      <p className="flex-1 text-[13px] leading-normal text-pace-ink-2">{note}</p>
      <Button type="button" variant="ghost" onClick={onConfirm} className={`${paceButtonBase} ${paceButtonStyles.ghost}`}>Looks right</Button>
    </div>
  );
}
