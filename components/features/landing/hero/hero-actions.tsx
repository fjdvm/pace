import { SignInLink } from "@/components/features/auth/sign-in/sign-in-link";

export function HeroActions() {
  return (
    <div className="flex w-full flex-col items-center gap-4 pt-10 sm:w-auto sm:flex-row">
      <SignInLink
        className="pace-press group relative flex h-[66px] w-full items-center justify-center overflow-hidden rounded-[18px] bg-pace-green shadow-[0_5px_0_0_#11923a] transition-transform hover:-translate-y-0.5 sm:w-[300px]"
      >
        <span
          aria-hidden
          className="absolute left-0 top-[-20px] h-[120px] w-[26px] animate-pace-sheen bg-white/20"
        />
        <span
          aria-hidden
          className="absolute left-9 top-[-20px] h-[120px] w-[26px] animate-pace-sheen bg-white/20 [animation-delay:150ms]"
        />
        <span className="relative text-xl font-semibold leading-[1.2] text-white">
          I’m a student
        </span>
      </SignInLink>
      <SignInLink
        className="pace-press flex h-[66px] w-full items-center justify-center rounded-[18px] border-[1.5px] border-pace-line bg-white text-xl font-semibold leading-[1.2] text-pace-ink shadow-[0_5px_0_0_#ddd9d0] transition-transform hover:-translate-y-0.5 active:translate-y-1 active:shadow-[0_1px_0_0_#ddd9d0] sm:w-[300px]"
      >
        I’m an instructor
      </SignInLink>
    </div>
  );
}
