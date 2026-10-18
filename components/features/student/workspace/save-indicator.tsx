import { PaceIcon } from "@/components/features/student/shared/pace-icon";
import type { AutosaveStatus } from "@/components/features/assignments/use-autosave";

const labels: Record<AutosaveStatus, string> = {
  idle: "Saved",
  saving: "Saving…",
  saved: "Saved just now",
  error: "Save failed",
};

type SaveIndicatorProps = {
  status: AutosaveStatus;
  isSubmitted: boolean;
};

export function SaveIndicator({ status, isSubmitted }: SaveIndicatorProps) {
  if (isSubmitted) return <span className="text-[13px] text-pace-muted">Submitted</span>;
  return (
    <span
      className={`flex items-center gap-1.5 text-[13px] ${status === "error" ? "text-pace-red" : "text-pace-muted"}`}
    >
      <PaceIcon name="workspace/cloud" size={16} />
      {labels[status]}
    </span>
  );
}
