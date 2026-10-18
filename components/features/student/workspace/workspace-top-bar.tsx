import Link from "next/link";
import { PaceTag } from "@/components/features/student/shared/pace-tag";
import { PaceIcon } from "@/components/features/student/shared/pace-icon";
import { formatDueLong, isUrgent } from "@/lib/student-dates";
import type { AutosaveStatus } from "@/components/features/assignments/use-autosave";
import { SaveIndicator } from "./save-indicator";

type WorkspaceTopBarProps = {
  className: string;
  title: string;
  language: string;
  dueDate: string;
  backHref: string;
  autosaveStatus: AutosaveStatus;
  isSubmitted: boolean;
  isRunning: boolean;
  isSubmitting: boolean;
  onRun: () => void;
  onSubmit: () => void;
};

export function WorkspaceTopBar(props: WorkspaceTopBarProps) {
  const busy = props.isRunning || props.isSubmitting;
  return (
    <header className="flex shrink-0 flex-wrap items-center gap-x-4 gap-y-2 border-b border-pace-line bg-white px-5 py-3">
      <Link
        href={props.backHref}
        aria-label="Back to class"
        className="flex size-9 shrink-0 items-center justify-center rounded-full border-[1.5px] border-pace-line"
      >
        <PaceIcon name="workspace/arrow-left" size={16} />
      </Link>
      <div className="flex min-w-0 flex-col gap-0.5">
        <span className="truncate text-[13px] leading-normal text-pace-muted">{props.className}</span>
        <span className="truncate text-base font-bold leading-snug tracking-[-0.005em] text-pace-ink">
          {props.title}
        </span>
      </div>
      <PaceTag tone="neutral">{props.language}</PaceTag>
      <PaceTag tone="red" className={isUrgent(props.dueDate) ? "" : "bg-pace-sunken text-pace-ink-2"}>
        Due {formatDueLong(props.dueDate)}
      </PaceTag>
      <div className="flex-1" />
      <SaveIndicator status={props.autosaveStatus} isSubmitted={props.isSubmitted} />
      {!props.isSubmitted && (
        <>
          <button
            type="button"
            onClick={props.onRun}
            disabled={busy}
            className="h-10 cursor-pointer rounded-full border-[1.5px] border-pace-line-strong bg-white px-[18px] text-sm font-bold text-pace-ink shadow-[0_3px_0_var(--color-pace-line-strong)] disabled:opacity-60"
          >
            {props.isRunning ? "Running…" : "Run tests"}
          </button>
          <button
            type="button"
            onClick={props.onSubmit}
            disabled={busy}
            className="h-10 cursor-pointer rounded-full bg-pace-green px-[18px] text-sm font-bold text-white shadow-[0_3px_0_var(--color-pace-green-deep)] disabled:opacity-60"
          >
            {props.isSubmitting ? "Submitting…" : "Submit"}
          </button>
        </>
      )}
    </header>
  );
}
