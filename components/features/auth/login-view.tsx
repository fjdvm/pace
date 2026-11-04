import Image from "next/image";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { GoogleSignInButton } from "./google-sign-in-button";
import { LoginError } from "./login-error";
import { Suspense } from "react";

export function LoginView() {
  return (
    <div className="relative flex min-h-svh flex-1 flex-col bg-pace-canvas text-pace-ink">
      <header className="absolute left-5 top-6 md:left-10 md:top-8">
        <Link href="/" aria-label="PACE home"
          className="font-wordmark text-[28px] leading-none font-medium tracking-[-0.84px]">
          Pace
        </Link>
      </header>
      <main className="flex flex-1 items-center justify-center px-5 py-24">
        <Card className="w-full max-w-[350px] items-center gap-[18px] rounded-[20px] border border-pace-line bg-white px-[22px] pt-9 pb-[30px] text-pace-ink shadow-[0_4px_0_0_var(--color-pace-line)] ring-0 md:max-w-[440px] md:px-8">
          <div className="flex size-[52px] shrink-0 items-center justify-center rounded-[14px] bg-pace-canvas">
            <Image src="/auth/google-sign-in/sign-in.svg" alt="" width={22} height={22} />
          </div>
          <div className="flex w-full flex-col gap-2 text-center">
            <h1 className="text-[22px] leading-[28px] font-bold">Sign in to PACE</h1>
            <p className="text-[14px] leading-[21px] text-pace-ink-2">
              Use your school Google account. First time here? We set up your account right after you sign in.
            </p>
          </div>
          <GoogleSignInButton />
          <div className="flex w-full items-start gap-[10px] rounded-[12px] bg-pace-canvas px-3 py-[10px]">
            <Image src="/auth/google-sign-in/recording.svg" alt="" width={16} height={16} className="shrink-0" />
            <p className="text-[11.5px] leading-[17px] text-pace-ink-2 md:text-xs">
              While you work on an activity, PACE records typing, pasting, and tab switches so your instructor can see how your code was made.
            </p>
          </div>
          <p className="w-full text-center text-[11.5px] leading-4 text-pace-muted">
            By continuing, you agree to the <Link href="/terms" className="hover:underline">Terms of Use</Link> and <Link href="/privacy" className="hover:underline">Privacy Policy</Link>.
          </p>
          <Suspense><LoginError /></Suspense>
        </Card>
      </main>
      <footer className="absolute inset-x-0 bottom-6 text-center text-xs leading-[15px] text-pace-ink-2 md:bottom-[29px]">
        Undergraduate research prototype · PUP Quezon City
      </footer>
    </div>
  );
}
