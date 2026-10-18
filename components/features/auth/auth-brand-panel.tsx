import { Wordmark } from "@/components/features/landing/shared/wordmark";
import { AuthPreviewCards } from "./auth-preview-cards";

type AuthBrandPanelProps = {
  headline: string;
  description: string;
};

export function AuthBrandPanel({ headline, description }: AuthBrandPanelProps) {
  return (
    <aside className="hidden min-h-screen w-5/12 shrink-0 flex-col justify-between gap-10 bg-pace-canvas px-16 py-14 lg:flex">
      <Wordmark />
      <div className="flex w-full max-w-[472px] flex-col gap-7">
        <h1 className="text-[44px] font-extrabold leading-[1.1] tracking-[-1.1px] text-pace-ink">
          {headline}
        </h1>
        <p className="max-w-[460px] text-lg leading-[1.55] text-pace-ink-2">{description}</p>
        <AuthPreviewCards />
      </div>
      <p className="text-[13px] leading-normal text-pace-muted">
        Undergraduate research prototype · PUP Quezon City
      </p>
    </aside>
  );
}
