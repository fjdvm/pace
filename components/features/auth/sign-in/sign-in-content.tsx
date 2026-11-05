import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { Dialog as DialogPrimitive } from "@base-ui/react/dialog";
import { GoogleSignInButton } from "../google-sign-in-button";
import { LoginError } from "../login-error";

export function SignInContent() {
  return (
    <div className="flex flex-col items-center gap-[18px]">
      <Image
        src="/brand/spark-buddy-trail.svg"
        alt=""
        width={150}
        height={131.25}
        priority
        className="h-auto w-[130px] sm:w-[150px]"
      />
      <div className="flex w-full flex-col gap-[10px] text-center">
        <DialogPrimitive.Title className="font-wordmark text-[32px] leading-none font-medium tracking-[-0.02em] sm:text-[38px]">
          Welcome back!
        </DialogPrimitive.Title>
        <DialogPrimitive.Description className="text-[14.5px] leading-[21px] text-pace-ink-2">
          Sign in with your school Google account.
        </DialogPrimitive.Description>
      </div>
      <GoogleSignInButton />
      <Suspense>
        <LoginError />
      </Suspense>
      <p className="w-full text-center text-xs leading-[17px] text-pace-ink-2">
        While you work on an activity, PACE records typing, pasting, and tab switches so your instructor can see how your code was made.
      </p>
      <p className="w-full text-center text-[11.5px] leading-4 text-pace-muted">
        By continuing, you agree to the <Link href="/terms" className="hover:underline">Terms of Use</Link> and <Link href="/privacy" className="hover:underline">Privacy Policy</Link>.
      </p>
      <p className="w-full text-center text-[11.5px] leading-4 text-pace-muted">
        Undergraduate research prototype · PUP Quezon City
      </p>
    </div>
  );
}
