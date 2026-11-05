import { SignInLink } from "@/components/features/auth/sign-in/sign-in-link";

const base =
  "flex h-[54px] w-full items-center justify-center rounded-2xl font-lp-sans text-base font-semibold transition-[transform,box-shadow] duration-100 active:translate-y-1 active:shadow-[0_0_0_0_transparent] sm:w-[218px]";

export function HeroActions() {
  return (
    <div
      data-hero-actions
      className="flex w-full flex-col items-center gap-3 pb-1 sm:w-auto sm:flex-row"
    >
      <SignInLink
        className={`${base} bg-[#2bc84e] text-white shadow-[0_4px_0_0_#178c33]`}
      >
        I&apos;m a student
      </SignInLink>
      <SignInLink
        className={`${base} bg-white text-lp-faint shadow-[0_4px_0_0_#dbd9d4]`}
      >
        I&apos;m an instructor
      </SignInLink>
    </div>
  );
}
