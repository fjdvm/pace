import { cn } from "@/lib/utils";
import { LandingIcon } from "../shared/landing-icon";

type IllustrationRowProps = {
  icon: string;
  label: string;
  className?: string;
  children?: React.ReactNode;
};

export function IllustrationRow({ icon, label, className, children }: IllustrationRowProps) {
  return (
    <div
      className={cn(
        "flex min-w-0 items-center justify-between gap-2 rounded-[14px] bg-white px-3.5 py-2.5",
        className,
      )}
    >
      <div className="flex min-w-0 items-center gap-2.5">
        <LandingIcon name={icon} size={16} />
        <span className="pace-small truncate font-semibold text-pace-ink">{label}</span>
      </div>
      {children}
    </div>
  );
}
