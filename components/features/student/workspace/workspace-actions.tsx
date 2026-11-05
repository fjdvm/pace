import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Props = {
  isRunning: boolean;
  isSubmitting: boolean;
  isSubmitted: boolean;
  onRun: () => void;
  onSubmit: () => void;
  mobile?: boolean;
};
export function WorkspaceActions(props: Props) {
  if (props.isSubmitted)
    return <span className="text-[13px] text-pace-green-deep">Turned in</span>;
  const busy = props.isRunning || props.isSubmitting;
  const style = cn(
    "rounded-full px-[18px] text-sm font-bold",
    props.mobile ? "h-[52px] flex-1 text-[15px]" : "h-10",
  );
  return (
    <>
      <Button
        variant="outline"
        disabled={busy}
        onClick={props.onRun}
        className={cn(
          style,
          "border-[1.5px] border-pace-line-strong bg-white text-pace-ink shadow-[0_3px_0_var(--color-pace-line-strong)]",
        )}
      >
        {props.isRunning ? "Running…" : "▶ Run"}
      </Button>
      <Button
        disabled={busy}
        onClick={props.onSubmit}
        className={cn(
          style,
          "bg-pace-green text-white shadow-[0_3px_0_var(--color-pace-green-deep)] hover:bg-pace-green-deep",
        )}
      >
        {props.isSubmitting
          ? "Turning in…"
          : props.mobile
            ? "Turn in"
            : "Submit"}
      </Button>
    </>
  );
}
