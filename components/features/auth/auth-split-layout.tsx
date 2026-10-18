import { landingFontClasses } from "@/components/features/landing/landing-fonts";
import { Wordmark } from "@/components/features/landing/shared/wordmark";
import { AuthBrandPanel } from "./auth-brand-panel";

type AuthSplitLayoutProps = {
  headline: string;
  description: string;
  children: React.ReactNode;
};

export function AuthSplitLayout({ headline, description, children }: AuthSplitLayoutProps) {
  return (
    <div className={`${landingFontClasses} flex min-h-screen w-full bg-white font-sans text-pace-ink`}>
      <AuthBrandPanel headline={headline} description={description} />
      <main className="flex flex-1 flex-col items-center justify-center px-6 py-10">
        <div className="flex w-full max-w-[400px] flex-col gap-6">
          <Wordmark className="lg:hidden" />
          {children}
        </div>
      </main>
    </div>
  );
}
