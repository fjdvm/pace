import type { ReactNode } from "react";

export function ActivityStat({
  value,
  label,
  desktopOnly = false,
}: {
  value: ReactNode;
  label: ReactNode;
  desktopOnly?: boolean;
}) {
  return (
    <div className={desktopOnly ? "hidden md:block" : undefined}>
      <b className="text-base md:text-[22px] md:tracking-[-0.22px]">{value}</b>
      <p className="text-[11px] font-bold uppercase tracking-[0.66px] text-pace-muted md:text-[13px] md:font-normal md:normal-case md:tracking-normal">
        {label}
      </p>
    </div>
  );
}
