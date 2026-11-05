import type { AutosaveStatus } from "@/components/features/assignments/use-autosave";
const labels: Record<AutosaveStatus, string> = {
  idle: "Saved",
  saving: "Saving…",
  saved: "Saved",
  error: "Save failed",
};
export function SaveIndicator({
  status,
  isSubmitted,
}: {
  status: AutosaveStatus;
  isSubmitted: boolean;
}) {
  return (
    <span
      role="status"
      className={status === "error" ? "text-pace-red" : "text-pace-muted"}
    >
      {isSubmitted ? "Turned in" : labels[status]}
    </span>
  );
}
