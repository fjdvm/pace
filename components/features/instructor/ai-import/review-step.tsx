import { Sparkles } from "lucide-react";
import { ReviewHeader } from "./review-header";
import { ReviewDetailsCard } from "./review-details-card";
import { ReviewItemCard } from "./review-item-card";
import { SourcePanel } from "./source-panel";
import { AddItemMenu } from "./add-item-menu";
import type { ReviewDraft } from "./use-review-draft";
import type { ImportSettings } from "@/lib/ai-import/types";
import { totalPoints } from "@/lib/ai-import/blank-item";

type Props = {
  draft: ReviewDraft;
  className: string;
  backHref: string;
  busy: boolean;
  settings: ImportSettings;
  onSave: () => void;
  onAssign: () => void;
  onImport: () => void;
  onScanAgain: () => void;
};

export function ReviewStep({ draft, className, backHref, busy, settings, onSave, onAssign, onImport, onScanAgain }: Props) {
  const checks = draft.items.filter((i) => i.checkNote).length;
  const fromFile = draft.items.filter((i) => i.fromFile).length;
  return (
    <div className="flex min-h-svh flex-col bg-pace-canvas">
      <ReviewHeader className={className} fileName={draft.fileName} busy={busy} backHref={backHref} onSave={onSave} onAssign={onAssign} />
      <div className="flex flex-1 items-start gap-6 px-4 py-4 md:px-12 md:py-6">
        <main className="flex min-w-0 flex-1 flex-col gap-4">
          {fromFile > 0 && (
            <p className="flex items-center gap-3 rounded-[12px] bg-pace-purple-tint p-3.5 text-[13px] font-bold text-pace-purple">
              <Sparkles className="size-4 shrink-0" aria-hidden />
              <span>{fromFile} items found in {draft.fileName} · {totalPoints(draft.items)} pts{checks ? ` · ${checks} ${checks === 1 ? "needs" : "need"} a look` : ""}. Check each one, edit anything, then assign.</span>
            </p>
          )}
          {draft.dropped > 0 && <p role="status" className="rounded-[12px] bg-pace-amber-tint p-3.5 text-[13px] font-bold">{draft.dropped} {draft.dropped === 1 ? "item was" : "items were"} skipped because the AI could not read them cleanly. Add them by hand if needed.</p>}
          <ReviewDetailsCard draft={draft} />
          {draft.items.map((item, index) => (
            <ReviewItemCard key={item.key} item={item} index={index} count={draft.items.length} open={draft.open === item.key}
              onToggle={() => draft.setOpen(draft.open === item.key ? null : item.key)}
              onChange={(patch) => draft.update(item.key, patch)} onMove={(d) => draft.move(item.key, d)} onRemove={() => draft.remove(item.key)} />
          ))}
          <AddItemMenu onAdd={(kind) => draft.add(kind, settings.language)} onImport={onImport} />
        </main>
        <SourcePanel fileName={draft.fileName} pages={draft.pages} items={draft.items} open={draft.open} onSelect={draft.setOpen} onScanAgain={onScanAgain} />
      </div>
    </div>
  );
}
