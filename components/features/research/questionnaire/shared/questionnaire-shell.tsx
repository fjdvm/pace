import { LandingFooter } from "@/components/features/landing/footer/landing-footer";
import { landingFontClasses } from "@/components/features/landing/landing-fonts";

type ShellProps = { nav: React.ReactNode; title: string; intro: string; children: React.ReactNode };

export function QuestionnaireShell({ nav, title, intro, children }: ShellProps) {
  return (
    <div className={`${landingFontClasses} pace-landing flex min-h-screen flex-col bg-lp-canvas font-lp-sans text-lp-ink`}>
      {nav}
      <main className="flex flex-1 flex-col items-center px-4 pb-20 pt-[132px] sm:pb-[120px] sm:pt-[150px]">
        <header className="flex w-full max-w-[760px] flex-col items-center gap-3.5 pb-10 text-center">
          <p className="text-[15px] font-medium text-lp-teal">Research</p>
          <h1 className="font-lp-serif text-[34px] font-medium leading-[34px] tracking-[-0.012em] text-lp-ink sm:text-[52px] sm:leading-[normal]">
            {title}
          </h1>
          <p className="text-base leading-6 text-lp-muted sm:text-lg sm:leading-[27px]">{intro}</p>
        </header>
        <div className="flex w-full max-w-[760px] flex-col gap-7">{children}</div>
      </main>
      <LandingFooter />
    </div>
  );
}
