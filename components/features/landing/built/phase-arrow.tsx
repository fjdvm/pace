import { LandingIcon } from "../shared/landing-icon";

export function PhaseArrow() {
  return (
    <span className="flex size-10 shrink-0 rotate-90 items-center justify-center self-center rounded-full bg-pace-ink lg:rotate-0">
      <LandingIcon name="icon-arrow-white" size={18} className="animate-pace-bob" />
    </span>
  );
}
