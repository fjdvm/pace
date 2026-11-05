import { Button } from "@/components/ui/button";

export function ItemOrderControls({
  index,
  count,
  title,
  disabled,
  onMove,
}: {
  index: number;
  count: number;
  title: string;
  disabled: boolean;
  onMove: (direction: number) => void;
}) {
  return (
    <div className="flex shrink-0 flex-col pl-2">
      <Button
        variant="ghost"
        size="icon"
        className="size-6"
        aria-label={`Move ${title} up`}
        disabled={disabled || index === 0}
        onClick={() => onMove(-1)}
      >
        ↑
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="size-6"
        aria-label={`Move ${title} down`}
        disabled={disabled || index === count - 1}
        onClick={() => onMove(1)}
      >
        ↓
      </Button>
    </div>
  );
}
