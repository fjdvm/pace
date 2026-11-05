"use client";

import Link from "next/link";
import { SignInLink } from "@/components/features/auth/sign-in/sign-in-link";
import { cn } from "@/lib/utils";
import type { LandingAccount } from "@/lib/landing-account";
import { Wordmark } from "../shared/wordmark";
import { useScrollState } from "../shared/use-scroll-state";

const signInClass =
  "pace-press pace-body rounded-full border-[1.5px] border-pace-line bg-white px-[22px] py-2.5 font-semibold text-pace-ink transition-colors hover:bg-pace-canvas";
const startClass =
  "pace-press pace-body rounded-full bg-pace-green px-[22px] py-3 font-semibold text-white shadow-[0_3px_0_var(--color-pace-green-deep)]";

export function LandingNavBar({ account }: { account: LandingAccount }) {
  const { scrolled, targetGone } = useScrollState("[data-hero-actions]");

  return (
    <header className="fixed inset-x-0 top-8 z-50 px-4 sm:px-7">
      <div
        data-scrolled={scrolled}
        className={cn(
          "mx-auto flex max-w-[1176px] items-center justify-between rounded-full border-[1.5px] border-transparent py-2 pl-7 pr-2 transition-[background-color,box-shadow,backdrop-filter,border-color] duration-300",
          scrolled && "border-pace-line bg-white/80 shadow-[0_8px_24px_rgba(0,0,0,0.08)] backdrop-blur-[12px]",
        )}
      >
        <Wordmark />
        <div className="flex items-center gap-2">
          {account ? (
            <Link href={account.href} className={signInClass}>
              {account.label}
            </Link>
          ) : (
            <SignInLink className={signInClass}>Sign in</SignInLink>
          )}
          {!account && (
            <SignInLink
              data-testid="nav-get-started"
              aria-hidden={!targetGone}
              tabIndex={targetGone ? 0 : -1}
              className={cn(
                startClass,
                "hidden transition-opacity duration-300 sm:block",
                targetGone ? "opacity-100" : "pointer-events-none opacity-0",
              )}
            >
              Get started
            </SignInLink>
          )}
        </div>
      </div>
    </header>
  );
}
