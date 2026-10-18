import { cn } from "@/lib/utils";
import { paceButtonBase, paceButtonStyles } from "./pace-button";

type PaceActionButtonProps = React.ComponentProps<"button"> & {
  variant?: keyof typeof paceButtonStyles;
};

export function PaceActionButton({ variant = "primary", className, type = "button", ...props }: PaceActionButtonProps) {
  return <button type={type} className={cn(paceButtonBase, paceButtonStyles[variant], className)} {...props} />;
}
