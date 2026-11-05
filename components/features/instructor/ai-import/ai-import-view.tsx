"use client";
import { useState } from "react";
import { UploadStep } from "./upload-step";
import { ReadingStep } from "./reading-step";
import { ReviewStep } from "./review-step";
import { useImportFlow } from "./use-import-flow";
import { useReviewDraft } from "./use-review-draft";
import { useSaveImport } from "./use-save-import";

export function AiImportView({ classId, className }: { classId: string; className: string }) {
  const draft = useReviewDraft();
  const [reviewing, setReviewing] = useState(false);
  const flow = useImportFlow(classId, (extracted) => { draft.load(extracted); setReviewing(true); });
  const { busy, save } = useSaveImport(classId, draft);
  const backHref = `/dashboard/classes/${classId}?tab=classwork`;

  if (flow.reading) return <ReadingStep fileName={flow.file?.name ?? draft.fileName} onCancel={flow.cancel} />;
  if (reviewing)
    return (
      <ReviewStep draft={draft} className={className} backHref={backHref} busy={busy} settings={flow.settings}
        onSave={() => save(false)} onAssign={() => save(true)}
        onImport={() => setReviewing(false)}
        onScanAgain={() => { draft.dropFromFile(); setReviewing(false); }} />
    );
  return (
    <UploadStep file={flow.file} settings={flow.settings} error={flow.error} cancelHref={draft.items.length ? "#" : backHref}
      onFile={flow.choose} onSettings={flow.setSettings} onExtract={flow.start} />
  );
}
