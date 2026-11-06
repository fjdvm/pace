import Link from "next/link";
import { SignInLink } from "@/components/features/auth/sign-in/sign-in-link";
import { Wordmark } from "@/components/features/landing/shared/wordmark";
import { getLandingAccount } from "@/lib/landing-account";

const outlineClass =
  "rounded-full border border-[#e3e1dd] bg-white px-4 py-2.5 text-[15px] font-medium text-lp-ink transition-colors hover:bg-lp-canvas sm:py-2 sm:text-sm";
const solidClass =
  "hidden rounded-full bg-lp-ink px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-85 sm:block";

export async function StudyNav() {
  const account = await getLandingAccount();

  return (
    <nav className="flex h-[60px] w-full max-w-[1176px] items-center rounded-[30px] border border-lp-line bg-white py-2.5 pl-[18px] pr-2 sm:h-[54px] sm:rounded-[28px] sm:px-6">
      <Wordmark />
      <div className="ml-auto flex items-center gap-2">
        {account ? (
          <Link href={account.href} className={outlineClass}>
            {account.label}
          </Link>
        ) : (
          <>
            <SignInLink className={outlineClass}>Sign in</SignInLink>
            <SignInLink className={solidClass}>Get started</SignInLink>
          </>
        )}
      </div>
    </nav>
  );
}
