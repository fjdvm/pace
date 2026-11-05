import { Button } from "@/components/ui/button";
type Props = {
  disabled: boolean;
  isLoading: boolean;
  isSubmitted: boolean;
  timeToRegen: string;
  regenMinutes: number;
  value: string;
  onChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
};
export function TutorComposer(props: Props) {
  const locked = props.disabled || props.isSubmitted || props.isLoading;
  return (
    <div className="flex shrink-0 flex-col gap-2 border-t border-pace-line px-4 pb-4 pt-3">
      <form
        onSubmit={props.onSubmit}
        className="flex items-center gap-2 rounded-[24px] border border-pace-line-strong py-1.5 pl-3.5 pr-1.5"
      >
        <input
          value={props.value}
          onChange={(e) => props.onChange(e.target.value)}
          disabled={locked}
          aria-label="Ask the tutor"
          placeholder={
            props.isSubmitted
              ? "Chat closes after submission"
              : props.disabled
                ? `Hearts refill in ${props.timeToRegen || "a bit"}`
                : "Ask about your code…"
          }
          className="min-w-0 flex-1 bg-transparent text-[13px] leading-normal outline-none placeholder:text-pace-muted"
        />
        <Button
          type="submit"
          aria-label="Send"
          disabled={locked || !props.value.trim()}
          className="size-9 rounded-full bg-pace-purple p-0 text-base font-bold text-white"
        >
          ↑
        </Button>
      </form>
      <p className="text-[11px] font-bold uppercase leading-[1.3] tracking-[0.66px] text-pace-muted">
        Uses 1 heart · Hearts refill every {props.regenMinutes} min
      </p>
    </div>
  );
}
