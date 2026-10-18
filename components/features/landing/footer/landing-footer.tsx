import { Wordmark } from "../shared/wordmark";
import { FooterColumn, type FooterLink } from "./footer-column";

const project: FooterLink[] = [
  { label: "The problem", href: "#problem" },
  { label: "Our approach", href: "#approach" },
  { label: "How it works", href: "#how-it-works" },
  { label: "The study", href: "#study" },
  { label: "Team", href: "#team" },
];

const prototype: FooterLink[] = [
  { label: "Sign in", href: "/login" },
  { label: "Create a student account", href: "/signup" },
  { label: "Request instructor access", href: "/signup" },
];

const research: FooterLink[] = [
  { label: "Paper", href: "https://github.com/fjdvm/fr-gaits", download: true },
  { label: "Questionnaire", href: "/research/questionnaire" },
];

export function LandingFooter({ homeHref = "" }: { homeHref?: string }) {
  return (
    <footer className="bg-pace-canvas px-6 pb-10 pt-[72px]">
      <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-12">
        <div className="flex flex-col justify-between gap-10 lg:flex-row">
          <div className="flex flex-col gap-4">
            <Wordmark />
            <p className="pace-body max-w-[360px] text-pace-ink-2">
              Programming AI-assisted Coding Environment. A research prototype by
              students of PUP Quezon City. Not a commercial product.
            </p>
          </div>
          <div className="flex flex-wrap gap-x-[72px] gap-y-8">
            <FooterColumn title="Project" links={project.map((l) => ({ ...l, href: `${homeHref}${l.href}` }))} />
            <FooterColumn title="Prototype" links={prototype} />
            <FooterColumn title="Research" links={research} />
          </div>
        </div>
        <div className="pace-small flex flex-col justify-between gap-2 border-t border-pace-line pt-6 text-pace-muted sm:flex-row">
          <p>© 2026 PACE research team · Polytechnic University of the Philippines, Quezon City</p>
          <p>Undergraduate Research</p>
        </div>
      </div>
    </footer>
  );
}
