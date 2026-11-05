import { Textarea } from "@/components/ui/textarea";
import type { ImportedItem } from "@/lib/ai-import/types";

export function ShortBody({ item, onChange }: { item: ImportedItem; onChange: (patch: Partial<ImportedItem>) => void }) {
  return (
    <>
      <Textarea value={item.instructions} onChange={(e) => onChange({ instructions: e.target.value })} aria-label="Instructions" placeholder="Extra guidance for Students (optional)" className="min-h-16 text-[15px]" />
      <p className="text-[13px] text-pace-muted">Students type an answer. You grade it by hand.</p>
    </>
  );
}
