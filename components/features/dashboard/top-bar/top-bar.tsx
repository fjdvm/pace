import Link from "next/link";
import { Wordmark } from "@/components/features/landing/shared/wordmark";
import { AccountMenu } from "./account-menu";
import { MenuButton } from "./menu-button";
import { PlusMenu } from "./plus-menu";

type TopBarProps = React.ComponentProps<typeof AccountMenu>;

export function TopBar(props: TopBarProps) {
  return (
    <header className="z-20 flex h-14 shrink-0 items-center gap-2 border-b border-pace-line bg-white pl-2 pr-4 md:h-16 md:gap-4 md:pl-4 md:pr-5">
      <MenuButton />
      <Wordmark className="hidden md:block" />
      <Link href="/dashboard" className="text-xl font-bold leading-tight tracking-[-0.01em] text-pace-ink md:hidden">
        Pace
      </Link>
      <div className="flex-1" />
      <PlusMenu />
      <AccountMenu {...props} />
    </header>
  );
}
