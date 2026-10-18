import { cn } from "@/lib/utils";
import type { ThemeTone } from "@/lib/study/themes";
import { themeFills } from "../theme-colors";

export function ThemeDot({ tone, className }: { tone: ThemeTone; className?: string }) {
  return <span className={cn("size-2.5 shrink-0 rounded-full", themeFills[tone], className)} />;
}
