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
        "flex items-center justify-between rounded-[14px] bg-white px-3.5 py-2.5",
        className,
      )}
    >
      <div className="flex items-center gap-2.5">
        <LandingIcon name={icon} size={16} />
        <span className="pace-small whitespace-nowrap font-semibold text-pace-ink">{label}</span>
      </div>
      {children}
    </div>
  );
}
