import { fileBadge } from "./file-meta";

export function ReadingPaper({ fileName }: { fileName: string }) {
  const badge = fileBadge(fileName);
  return (
    <div className="hidden h-full min-h-[480px] shrink-0 justify-center rounded-[12px] bg-pace-sunken p-8 md:flex">
      <div className="h-fit w-[520px] max-w-full space-y-3.5 rounded-[4px] border border-pace-line bg-white p-7 shadow-[0_4px_16px_rgba(0,0,0,.12)]">
        <p className="text-[11px] font-bold uppercase tracking-[.66px] text-pace-muted">{badge.label} · {fileName}</p>
        {[1, 2, 3].map((n) => (
          <div key={n} className="flex items-start gap-2.5 rounded-[6px] border border-dashed border-pace-purple bg-pace-purple-tint p-2.5">
            <span className="flex size-[22px] shrink-0 items-center justify-center rounded-full bg-pace-purple text-[11px] font-bold text-white">{n}</span>
            <div className="w-full space-y-2 pt-2">
              <div className="h-1.5 w-full rounded-[3px] bg-pace-sunken" />
              <div className="h-1.5 w-2/3 rounded-[3px] bg-pace-sunken" />
            </div>
          </div>
        ))}
        {[464, 404, 344].map((w) => <div key={w} className="h-1.5 rounded-[3px] bg-pace-sunken" style={{ width: w, maxWidth: "100%" }} />)}
      </div>
    </div>
  );
}
