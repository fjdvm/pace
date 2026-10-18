import { cn } from "@/lib/utils";

type VisualFrameProps = {
  className: string;
  children: React.ReactNode;
};

export function VisualFrame({ className, children }: VisualFrameProps) {
  return (
    <div className="flex w-full justify-center lg:w-[660px] lg:shrink-0">
      <div className="[zoom:0.5] min-[480px]:[zoom:0.65] sm:[zoom:0.85] lg:[zoom:1]">
        <div
          className={cn(
            "relative h-[480px] w-[660px] overflow-hidden rounded-[48px]",
            className,
          )}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
