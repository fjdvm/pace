import { fileBadge, fileSize } from "./file-meta";

export function UploadedFileRow({ file, onRemove }: { file: File; onRemove: () => void }) {
  const badge = fileBadge(file.name);
  return (
    <div className="flex items-center gap-3 rounded-[8px] border border-pace-line p-3">
      <span className={`flex size-10 shrink-0 items-center justify-center rounded-[6px] text-[11px] font-bold tracking-[.66px] ${badge.className}`}>{badge.label}</span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-[15px] font-bold leading-[1.55]">{file.name}</p>
        <p className="text-[13px] text-pace-muted">{fileSize(file.size)} · Ready</p>
      </div>
      <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-pace-green text-[11px] font-bold text-white">✓</span>
      <button type="button" onClick={onRemove} className="text-[13px] font-bold text-pace-ink-2">Remove</button>
    </div>
  );
}
