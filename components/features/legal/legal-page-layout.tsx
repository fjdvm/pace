import { landingFontClasses } from "@/components/features/landing/landing-fonts";
import { LandingNav } from "@/components/features/landing/nav/landing-nav";
import { LandingFooter } from "@/components/features/landing/footer/landing-footer";

export function LegalPageLayout({
  title,
  updatedAt,
  children,
}: {
  title: string;
  updatedAt: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={`${landingFontClasses} pace-landing flex min-h-screen flex-col bg-pace-canvas font-pace-sans text-pace-ink`}
    >
      <LandingNav homeHref="/" />
      <main className="mx-auto w-full max-w-[800px] flex-1 px-6 pb-20 pt-36">
        <p className="pace-eyebrow mb-4 text-pace-green-deep">Legal</p>
        <h1 className="pace-h2 mb-3">{title}</h1>
        <p className="pace-small mb-10 text-pace-muted">Last updated: {updatedAt}</p>
        <div className="flex flex-col gap-4">{children}</div>
      </main>
      <LandingFooter homeHref="/" />
    </div>
  );
}
