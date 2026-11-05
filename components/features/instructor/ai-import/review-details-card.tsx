import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { totalPoints } from "@/lib/ai-import/blank-item";
import type { ReviewDraft } from "./use-review-draft";

export function ReviewDetailsCard({ draft }: { draft: ReviewDraft }) {
  const count = draft.items.length;
  return (
    <div className="flex flex-col gap-3.5 rounded-[12px] border border-pace-line bg-white p-5 md:p-6">
      <div className="space-y-2">
        <Label className="text-[13px] font-semibold">Title</Label>
        <Input value={draft.title} onChange={(e) => draft.setTitle(e.target.value)} className="h-12 rounded-[12px] border-[1.5px] border-pace-line-strong px-4" />
      </div>
      <div className="space-y-2">
        <Label className="text-[13px] font-semibold">Instructions (optional)</Label>
        <Input value={draft.instructions} onChange={(e) => draft.setInstructions(e.target.value)} className="h-12 rounded-[12px] border-[1.5px] border-pace-line-strong px-4" />
      </div>
      <p className="text-[13px] leading-normal"><b>{count} {count === 1 ? "item" : "items"}</b> <span className="text-pace-muted">· {totalPoints(draft.items)} points total (added up from the items)</span></p>
    </div>
  );
}
