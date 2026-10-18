import { LandingIcon } from "../shared/landing-icon";

const claims = [
  { title: "Better grades or skills.", note: "We don’t measure learning outcomes." },
  { title: "A tutor that adapts to you.", note: "Hint levels depend only on hearts spent." },
  { title: "That flags prove copying.", note: "They only prompt an instructor to review." },
  { title: "That hearts build self-regulation.", note: "It’s the reason for the design, not a measured result." },
];

export function ClaimsPanel() {
  return (
    <div className="flex flex-col gap-[18px] rounded-[32px] bg-pace-night p-8 lg:w-[440px] lg:shrink-0 lg:rounded-[48px] lg:p-9">
      <p className="pace-h4 text-pace-cream">What we don’t claim</p>
      {claims.map((claim) => (
        <div key={claim.title} className="flex items-start gap-3.5">
          <span className="mt-0.5 flex size-[26px] shrink-0 items-center justify-center rounded-full bg-pace-night-2">
            <LandingIcon name="icon-x-cream" size={13} />
          </span>
          <div className="pace-body flex flex-col gap-0.5 text-pace-cream">
            <p className="font-semibold">{claim.title}</p>
            <p className="opacity-70">{claim.note}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
