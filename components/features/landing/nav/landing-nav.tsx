import Link from "next/link";
import { Wordmark } from "../shared/wordmark";
import { getLandingAccount } from "@/lib/landing-account";
import { LandingMobileNav } from "./landing-mobile-nav";
import { navLinks } from "./nav-links";

export async function LandingNav({ homeHref = "" }: { homeHref?: string }) {
  const account = await getLandingAccount();
  return (
    <header className="fixed inset-x-0 top-0 z-50 px-4 pt-3.5 sm:px-7">
      <div className="mx-auto flex max-w-[1384px] items-center justify-between rounded-full border-[1.5px] border-pace-line bg-white py-2 pl-7 pr-2 shadow-[0_4px_16px_rgba(0,0,0,0.05)]">
        <div className="w-[200px]">
          <Wordmark />
        </div>
        <nav className="pace-body hidden items-center gap-8 font-medium text-pace-ink-2 lg:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={`${homeHref}${link.href}`}
              className="transition-colors hover:text-pace-ink"
            >
              {link.label}
            </a>
          ))}
        </nav>
        <div className="flex w-[200px] items-center justify-end gap-2">
          <Link
            href={account?.href ?? "/login"}
            className="pace-press pace-body rounded-full border-[1.5px] border-pace-line bg-white px-[22px] py-3 font-semibold text-pace-ink transition-colors hover:bg-pace-canvas"
          >
            {account?.label ?? "Sign in"}
          </Link>
          <LandingMobileNav homeHref={homeHref} account={account} />
        </div>
      </div>
    </header>
  );
}
