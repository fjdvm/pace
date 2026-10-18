import { cn } from "@/lib/utils";
import { PaceIcon } from "@/components/features/student/shared/pace-icon";

const prompts = [
  ["workspace/code-14", "Explain my code", "Explain what my code does, step by step."],
  ["workspace/search-14", "Where’s the bug?", "Where’s the bug in my code?"],
  ["workspace/lightbulb", "Explain a concept", "Can you explain the concept I'm struggling with here?"],
  ["workspace/route", "What’s my next step?", "What should my next step be?"],
];

type TutorComposerProps = {
  disabled: boolean;
  isLoading: boolean;
  isSubmitted: boolean;
  timeToRegen: string;
  value: string;
  onChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onQuickPrompt: (text: string) => void;
};

export function TutorComposer(props: TutorComposerProps) {
  const { disabled, isLoading, isSubmitted, timeToRegen, value, onChange, onSubmit, onQuickPrompt } = props;
  const locked = disabled || isSubmitted;
  const placeholder = isSubmitted
    ? "Chat closes after submission"
    : disabled
      ? `Hearts refill in ${timeToRegen || "a bit"}`
      : "Ask about your code…";

  return (
    <>
      <div className={cn("grid shrink-0 grid-cols-2 gap-2 px-5 pb-2.5", locked && "opacity-35")}>
        {prompts.map(([icon, label, text]) => (
          <button
            key={label}
            type="button"
            disabled={locked || isLoading}
            onClick={() => onQuickPrompt(text)}
            className="flex cursor-pointer items-center gap-1.5 rounded-xl border-[1.5px] border-pace-line-strong px-3 py-[9px] text-left text-[13px] font-semibold leading-normal text-pace-ink"
          >
            <PaceIcon name={icon} size={14} />
            <span className="truncate">{label}</span>
          </button>
        ))}
      </div>
      <div className="flex shrink-0 flex-col gap-2 px-5 pb-[18px]">
        <form
          onSubmit={onSubmit}
          className={cn(
            "flex items-center gap-2 rounded-2xl border-2 py-1.5 pl-4 pr-1.5",
            locked ? "border-pace-line-strong opacity-50" : "border-pace-ink",
          )}
        >
          <input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            disabled={locked || isLoading}
            placeholder={placeholder}
            aria-label="Ask the tutor"
            className="min-w-0 flex-1 bg-transparent text-[15px] leading-[1.55] text-pace-ink outline-none placeholder:text-pace-muted"
          />
          <button
            type="submit"
            aria-label="Send"
            disabled={locked || isLoading || !value.trim()}
            className={cn(
              "flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-xl",
              locked ? "bg-pace-sunken" : "bg-pace-purple disabled:opacity-60",
            )}
          >
            <PaceIcon name="workspace/send" size={16} />
          </button>
        </form>
        <p className="flex items-center gap-1.5 text-[13px] leading-normal text-pace-muted">
          <PaceIcon name="workspace/heart-12" size={12} />
          {disabled ? "You can keep coding and running tests while you wait." : "Each question uses 1 heart."}
        </p>
      </div>
    </>
  );
}
