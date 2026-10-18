import { cn } from "@/lib/utils";

type SubmitBarProps = {
  ready: boolean;
  total: number;
  isSubmitting: boolean;
  onSubmit: () => void;
};

export function SubmitBar({ ready, total, isSubmitting, onSubmit }: SubmitBarProps) {
  return (
    <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
      <p className="pace-body text-pace-ink-2">
        Answer all {total} statements to submit. You can’t edit your answers afterward.
      </p>
      <button
        type="button"
        disabled={!ready || isSubmitting}
        onClick={onSubmit}
        className={cn(
          "pace-body h-[60px] w-full cursor-pointer rounded-2xl px-8 font-semibold sm:w-60",
          ready ? "bg-pace-ink text-white shadow-[0_4px_0_0_black]" : "cursor-not-allowed bg-pace-sunken text-pace-muted",
        )}
      >
        {isSubmitting ? "Submitting..." : "Submit answers"}
      </button>
    </div>
  );
}
