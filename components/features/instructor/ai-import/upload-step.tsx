import Link from "next/link";
import { Button } from "@/components/ui/button";
import { paceButtonStyles } from "@/components/features/student/shared/pace-button";
import { FileDropZone } from "./file-drop-zone";
import { UploadedFileRow } from "./uploaded-file-row";
import { ImportSettingsFields } from "./import-settings";
import type { ImportSettings } from "@/lib/ai-import/types";

type Props = {
  file: File | null;
  settings: ImportSettings;
  error: string | null;
  cancelHref: string;
  onFile: (file: File | null) => void;
  onSettings: (next: ImportSettings) => void;
  onExtract: () => void;
};

export function UploadStep({ file, settings, error, cancelHref, onFile, onSettings, onExtract }: Props) {
  return (
    <div className="flex flex-1 justify-center px-4 py-6 md:pt-10">
      <div className="flex h-fit w-full max-w-[720px] flex-col gap-5 rounded-[12px] border border-pace-line bg-white p-5 md:p-8">
        <div className="space-y-1">
          <h1 className="text-[22px] font-bold leading-tight tracking-[-.22px]">Add items from a file</h1>
          <p className="text-[13px] leading-normal text-pace-ink-2">Upload your activity sheet. The AI reads it and turns each item into a ready-to-edit activity. Nothing is posted until you review it.</p>
        </div>
        {error && <p role="alert" className="rounded-[8px] bg-pace-red-tint p-3 text-[13px] font-bold text-pace-red">{error}</p>}
        {file ? <UploadedFileRow file={file} onRemove={() => onFile(null)} /> : <FileDropZone onFile={onFile} />}
        <ImportSettingsFields value={settings} onChange={onSettings} />
        <div className="flex justify-end gap-3">
          <Link href={cancelHref} className="inline-flex h-[52px] items-center rounded-full px-7 text-[15px] font-bold">Cancel</Link>
          <Button disabled={!file} onClick={onExtract} className={`h-[52px] rounded-full px-7 text-[15px] font-bold ${paceButtonStyles.green}`}>✦ Extract with AI</Button>
        </div>
      </div>
    </div>
  );
}
