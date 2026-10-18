import { landingFontClasses } from "./landing-fonts";
import { LandingNav } from "./nav/landing-nav";
import { LandingHero } from "./hero/landing-hero";
import { WhatIsPace } from "./what-is-pace/what-is-pace";
import { ProblemSection } from "./problem/problem-section";
import { ApproachSection } from "./approach/approach-section";
import { HowItWorksSection } from "./how-it-works/how-it-works-section";
import { InstructorsSection } from "./instructors/instructors-section";
import { StudySection } from "./study/study-section";
import { BuiltSection } from "./built/built-section";
import { TeamSection } from "./team/team-section";
import { CtaSection } from "./cta/cta-section";
import { LandingFooter } from "./footer/landing-footer";

export function LandingView() {
  return (
    <div
      className={`${landingFontClasses} pace-landing flex min-h-screen flex-col bg-pace-canvas font-pace-sans text-pace-ink`}
    >
      <LandingNav />
      <main className="flex flex-col">
        <LandingHero />
        <WhatIsPace />
        <ProblemSection />
        <ApproachSection />
        <HowItWorksSection />
        <InstructorsSection />
        <StudySection />
        <BuiltSection />
        <TeamSection />
        <CtaSection />
      </main>
      <LandingFooter />
    </div>
  );
}
