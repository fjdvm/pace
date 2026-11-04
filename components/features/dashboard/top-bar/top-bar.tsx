import { Wordmark } from "@/components/features/landing/shared/wordmark";
import { AccountMenu } from "./account-menu";
import { ActiveClassTitle } from "./active-class-title";
import { MenuButton } from "./menu-button";
import { HomePlusMenu } from "./home-plus-menu";
import type { NamedClass } from "./use-active-class";

type TopBarProps = React.ComponentProps<typeof AccountMenu> & { classes: NamedClass[] };

export function TopBar({ classes, ...account }: TopBarProps) {
  return (
    <header className="z-20 flex h-14 shrink-0 items-center gap-2 border-b border-pace-line bg-white pl-2 pr-4 md:h-16 md:gap-4 md:pl-4 md:pr-5">
      <MenuButton />
      <Wordmark className="hidden md:block" />
      <ActiveClassTitle classes={classes} />
      <div className="flex-1" />
      <HomePlusMenu />
      <AccountMenu {...account} />
    </header>
  );
}
