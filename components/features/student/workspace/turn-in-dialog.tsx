import {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Dialog as DialogPrimitive } from "@base-ui/react/dialog";
import { Button } from "@/components/ui/button";
import type {
  WorkspaceItem,
  TestRunResult,
} from "@/components/features/assignments/types";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  items: WorkspaceItem[];
  results: Record<string, TestRunResult[] | null>;
  heartsUsed: number;
  maxHearts: number;
  busy: boolean;
  onConfirm: () => void;
};
export function TurnInDialog(props: Props) {
  return (
    <Dialog
      open={props.open}
      onOpenChange={(open) => {
        if (!props.busy) props.onOpenChange(open);
      }}
    >
      <DialogPortal>
        <DialogOverlay className="bg-[#141414]/45 backdrop-blur-none!" />
        <DialogPrimitive.Popup className="fixed left-1/2 top-1/2 z-50 flex w-[440px] max-w-[calc(100%-32px)] -translate-x-1/2 -translate-y-1/2 flex-col gap-4 rounded-[16px] bg-white px-6 pb-5 pt-6 text-pace-ink outline-none">
          <DialogTitle className="text-[22px] font-bold leading-[1.25] tracking-[-0.22px]">
            Turn in{" "}
            {props.items.length === 1
              ? "this item"
              : `all ${props.items.length} items`}
            ?
          </DialogTitle>
          <div className="flex flex-col gap-2 text-[13px] leading-normal text-pace-ink-2">
            {props.items.map((item, i) => {
              const results = props.results[item.id];
              const passed = results?.filter((r) => r.passed).length ?? 0;
              return (
                <p key={item.id} className="flex items-center gap-2.5">
                  <span
                    className={`size-2 shrink-0 rounded-full ${results && passed === results.length ? "bg-pace-green" : "bg-pace-line-strong"}`}
                  />
                  Item {i + 1} · {item.kind === "multiple_choice" ? "Multiple choice" : "Coding"}:{" "}
                  {item.kind === "multiple_choice" ? "Auto-scored on turn-in" : results
                    ? `${passed} of ${results.length} visible tests pass`
                    : "not run"}
                </p>
              );
            })}
            <p className="flex items-center gap-2.5">
              <span className="size-2 shrink-0 rounded-full bg-pace-line-strong" />
              Hidden tests run after you turn in · hearts used:{" "}
              {props.heartsUsed} of {props.maxHearts}
            </p>
          </div>
          <DialogDescription className="text-[13px] leading-normal text-pace-muted">
            You can only turn in once. Check your work before you continue.
          </DialogDescription>
          <div className="flex justify-end gap-2">
            <Button
              variant="ghost"
              disabled={props.busy}
              onClick={() => props.onOpenChange(false)}
              className="h-10 rounded-full px-[18px] text-sm font-bold"
            >
              Cancel
            </Button>
            <Button
              disabled={props.busy}
              onClick={props.onConfirm}
              className="h-10 rounded-full bg-pace-green px-[18px] text-sm font-bold text-white shadow-[0_3px_0_var(--color-pace-green-deep)] hover:bg-pace-green-deep"
            >
              {props.busy ? "Turning in…" : "Turn in"}
            </Button>
          </div>
        </DialogPrimitive.Popup>
      </DialogPortal>
    </Dialog>
  );
}
