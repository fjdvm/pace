import { cn } from "@/lib/utils";
import { ResizableHandle } from "@/components/ui/resizable";

export function WorkspaceResizeHandle({ className }: { className?: string }) {
  return (
    <ResizableHandle
      className={cn(
        "bg-pace-line transition-colors after:w-3 data-[separator=hover]:bg-pace-green data-[separator=active]:bg-pace-green aria-[orientation=horizontal]:after:h-3",
        className,
      )}
    />
  );
}
