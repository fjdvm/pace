import { cn } from "@/lib/utils";

export const button3dClass =
  "pace-press flex h-[54px] w-full max-w-[320px] items-center justify-center rounded-[16px] bg-[#2bc84e] py-4 font-lp-sans text-base font-semibold text-white shadow-[0_4px_0_0_#178c33] disabled:cursor-not-allowed disabled:opacity-50";

export function Button3D({ className, type = "button", ...props }: React.ComponentProps<"button">) {
  return <button type={type} className={cn(button3dClass, className)} {...props} />;
}
