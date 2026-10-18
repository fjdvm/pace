import { LandingIcon } from "../shared/landing-icon";

export function ResearchChip() {
  return (
    <div className="pace-small inline-flex max-w-full items-center gap-2 rounded-full bg-pace-mint px-3.5 py-[7px] font-semibold text-pace-green-deep">
      <LandingIcon name="hero-flask" size={15} />
      <span className="text-center">
        Research prototype · Undergraduate research, PUP Quezon City
      </span>
    </div>
  );
}
