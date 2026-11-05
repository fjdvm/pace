import { Button } from "@/components/ui/button";
import { itemComplete } from "./item-completion";
import type { useWorkspace } from "./use-workspace";
export function ChoiceNavigation({
  ws,
  index,
  mobile,
}: {
  ws: ReturnType<typeof useWorkspace>;
  index: number;
  mobile: boolean;
}) {
  const done = ws.items.filter((item) =>
    item.kind === "multiple_choice"
      ? ws.codes[item.id] !== ""
      : itemComplete(ws.itemResults[item.id]),
  ).length;
  return (
    <>
      <Button
        variant="outline"
        disabled={index === 0 || ws.isSubmitting}
        onClick={() => ws.setActiveId(ws.items[index - 1].id)}
        className={`rounded-full border-pace-line-strong bg-white font-bold shadow-[0_3px_0_#d6d3cb] ${mobile ? "h-[52px] flex-1" : "h-10 px-[18px]"}`}
      >
        ‹ Item {index}
      </Button>
      <span className="hidden flex-1 text-right text-[13px] text-pace-muted lg:block">
        {done} of {ws.items.length} done
      </span>
      {index < ws.items.length - 1 && (
        <Button
          variant={mobile ? "default" : "outline"}
          disabled={ws.isSubmitting}
          onClick={() => ws.setActiveId(ws.items[index + 1].id)}
          className={`rounded-full font-bold ${mobile ? "h-[52px] flex-1 bg-pace-green text-white shadow-[0_3px_0_#11923a]" : "h-10 bg-white px-[18px] shadow-[0_3px_0_#d6d3cb]"}`}
        >
          Item {index + 2} ›
        </Button>
      )}
      {(!mobile || index === ws.items.length - 1) && (
        <Button
          disabled={!!ws.submission || ws.isSubmitting}
          onClick={() => ws.setConfirmOpen(true)}
          className="h-10 rounded-full bg-pace-green text-white"
        >
          Turn in
        </Button>
      )}
    </>
  );
}
