import { Button } from "@/components/ui/button";
import { paceButtonBase, paceButtonStyles } from "@/components/features/student/shared/pace-button";
import { ProgressBar } from "@/components/features/student/shared/progress-bar";
import { ReadingPaper } from "./reading-paper";
import { READING_STAGES, ReadingStages } from "./reading-stages";
import { useReadingStage } from "./use-reading-stage";

export function ReadingStep({ fileName, onCancel }: { fileName: string; onCancel: () => void }) {
  const { stage, seconds } = useReadingStage(true, READING_STAGES.length);
  return (
    <div className="flex flex-1 flex-col gap-6 px-4 py-6 md:grid md:min-h-[calc(100svh-64px)] md:grid-cols-2 md:gap-12 md:px-[120px] md:pt-10">
      <ReadingPaper fileName={fileName} />
      <div className="flex min-w-0 flex-1 flex-col gap-5 pt-3" role="status" aria-live="polite">
        <div className="flex items-center gap-2">
          <span className="text-base font-bold text-pace-purple">✦</span>
          <h1 className="text-[22px] font-bold tracking-[-.22px]">Reading your file…</h1>
        </div>
        <p className="truncate text-[13px] text-pace-muted">{fileName}</p>
        <div aria-label="Reading in progress" className="animate-pulse motion-reduce:animate-none">
          <ProgressBar value={((stage + 1) / READING_STAGES.length) * 90} tone="purple" />
        </div>
        <p className="text-[13px] text-pace-muted">{stage === READING_STAGES.length - 1 ? "Still reading your file. Larger files can take a few minutes." : "Preparing your draft. This screen updates while you wait."}</p>
        <p className="text-[13px] text-pace-muted">{seconds}s elapsed · Estimated steps</p>
        <ReadingStages stage={stage} />
        <p className="rounded-[8px] bg-pace-canvas p-3.5 text-[13px] leading-normal text-pace-ink-2">This takes about a minute. Keep this page open; the draft opens as soon as it is ready.</p>
        <Button type="button" onClick={onCancel} className={`${paceButtonBase} ${paceButtonStyles.secondary} w-fit`}>Cancel import</Button>
      </div>
    </div>
  );
}
