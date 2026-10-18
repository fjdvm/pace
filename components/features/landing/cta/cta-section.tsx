import Link from "next/link";
import { LandingIcon } from "../shared/landing-icon";
import { CtaShapes } from "./cta-shapes";

export function CtaSection() {
  return (
    <section className="bg-white px-6 pb-20 lg:pb-[120px]">
      <div className="relative mx-auto flex w-full max-w-[1200px] flex-col gap-[22px] overflow-hidden rounded-[32px] bg-pace-green px-6 py-14 sm:rounded-[54px] lg:min-h-[420px] lg:px-[72px] lg:py-[72px]">
        <p className="pace-eyebrow text-pace-ink">For study participants</p>
        <h2 className="pace-h2 max-w-[640px] text-pace-ink">Taking part in the study?</h2>
        <p className="pace-body-l max-w-[600px] text-pace-ink">
          Sign in, work through an assignment with the tutor, then answer the
          questionnaire. Your feedback shapes the next version of PACE.
        </p>
        <div className="flex flex-col gap-3.5 pt-2 sm:flex-row">
          <Link
            href="/login"
            className="pace-press pace-body flex items-center justify-center gap-2.5 rounded-2xl bg-pace-ink px-[26px] py-4 font-semibold leading-[1.2] text-white shadow-[0_4px_0_0_black] transition-transform hover:-translate-y-0.5"
          >
            Sign in to PACE
            <LandingIcon name="icon-arrow-cta" size={18} />
          </Link>
          <Link
            href="/signup"
            className="pace-press pace-body flex items-center justify-center rounded-2xl border-[1.5px] border-pace-line bg-white px-[26px] py-4 font-semibold leading-[1.2] text-pace-ink shadow-[0_4px_0_0_#d9d5cc] transition-transform hover:-translate-y-0.5"
          >
            Request instructor access
          </Link>
        </div>
        <CtaShapes />
      </div>
    </section>
  );
}
