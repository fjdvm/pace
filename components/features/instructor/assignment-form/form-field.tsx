import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export const formControl =
  "h-12 w-full rounded-xl border-[1.5px] border-pace-line-strong bg-white px-4 text-[15px] font-normal text-pace-ink shadow-none placeholder:text-pace-muted md:text-[15px]";
export const formCard =
  "flex flex-col gap-4 rounded-lg border border-pace-line bg-white px-6 pb-6 pt-5";

export function FormField({
  label,
  htmlFor,
  children,
  className,
}: {
  label: string;
  htmlFor?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex min-w-0 flex-col gap-2", className)}>
      <label
        htmlFor={htmlFor}
        className="text-[13px] font-semibold leading-normal text-pace-ink"
      >
        {label}
      </label>
      {children}
    </div>
  );
}
