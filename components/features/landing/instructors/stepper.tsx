import { LandingIcon } from "../shared/landing-icon";

export function Stepper({ value }: { value: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="flex size-7 items-center justify-center rounded-lg border-[1.5px] border-pace-line">
        <LandingIcon name="icon-minus" size={14} />
      </span>
      <span className="pace-body whitespace-nowrap font-semibold text-pace-ink">{value}</span>
      <span className="flex size-7 items-center justify-center rounded-lg border-[1.5px] border-pace-line">
        <LandingIcon name="icon-plus" size={14} />
      </span>
    </div>
  );
}
