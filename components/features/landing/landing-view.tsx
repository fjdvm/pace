import { landingFontClasses } from "./landing-fonts";
import { LandingNav } from "./nav/landing-nav";
import { LandingHero } from "./hero/landing-hero";
import { MeetSparkSection } from "./meet-spark/meet-spark-section";
import { CtaSection } from "./cta/cta-section";
import { LandingFooter } from "./footer/landing-footer";

export function LandingView() {
  return (
    <div
      className={`${landingFontClasses} pace-landing flex min-h-screen overflow-x-clip flex-col bg-pace-canvas font-pace-sans text-pace-ink`}
    >
      <LandingNav />
      <main className="flex flex-col">
        <LandingHero />
        <MeetSparkSection />
        <CtaSection />
      </main>
      <LandingFooter />
    </div>
  );
}
