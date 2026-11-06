import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function ImageCard({ className, children }: { className: string; children: ReactNode }) {
  return (
    <div
      className={cn(
        "relative h-[263px] w-[350px] shrink-0 overflow-clip rounded-[24px] border border-[#e3e1dc] xl:h-[385px] xl:w-[555px]",
        className,
      )}
    >
      <div className="absolute left-0 top-0 h-[385px] w-[555px] origin-top-left scale-[0.63] xl:scale-100">
        {children}
      </div>
    </div>
  );
}
