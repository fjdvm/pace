import type { ReactNode } from "react";
import { landingFontClasses } from "@/components/features/landing/landing-fonts";
import { LandingFooter } from "@/components/features/landing/footer/landing-footer";
import { PageHeader } from "./page-header";
import { Toc } from "./toc";
import { slugify } from "./slugify";

export type PageSection = { title: string; body: ReactNode };

type StudyPageLayoutProps = { eyebrow: string; title: string; intro: string; sections: PageSection[] };

export function StudyPageLayout({ eyebrow, title, intro, sections }: StudyPageLayoutProps) {
  return (
    <div className={`${landingFontClasses} pace-landing flex min-h-screen flex-col bg-white font-lp-sans text-lp-ink`}>
      <PageHeader eyebrow={eyebrow} title={title} intro={intro} />
      <main className="flex-1 px-5 pb-16 pt-10 sm:px-6 lg:pb-[110px] lg:pt-[72px]">
        <div className="mx-auto flex w-full max-w-[1110px] gap-20">
          <Toc titles={sections.map((section) => section.title)} />
          <article className="flex min-w-0 flex-1 flex-col gap-9 lg:max-w-[780px]">
            {sections.map((section) => (
              <section key={section.title} id={slugify(section.title)} className="flex scroll-mt-8 flex-col gap-5">
                <h2 className="text-2xl font-normal leading-[30px] tracking-[-0.192px] text-lp-ink sm:text-[28px] sm:leading-9 sm:tracking-[-0.224px]">
                  {section.title}
                </h2>
                {section.body}
              </section>
            ))}
          </article>
        </div>
      </main>
      <LandingFooter />
    </div>
  );
}
