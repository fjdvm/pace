import { useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";

const SHOW_DELAY_MS = 120;
const GIVE_UP_MS = 20_000;

function isInternalNavigation(event: MouseEvent) {
  if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return false;
  const anchor = (event.target as Element | null)?.closest?.("a[href]") as HTMLAnchorElement | null;
  if (!anchor || (anchor.target && anchor.target !== "_self") || anchor.hasAttribute("download")) return false;
  const url = new URL(anchor.href, window.location.href);
  if (url.origin !== window.location.origin) return false;
  return url.pathname !== window.location.pathname || url.search !== window.location.search;
}

const locationKey = (pathname: string, search: string) => `${pathname}?${search}`;

export function useNavigationLoading() {
  const key = locationKey(usePathname(), useSearchParams().toString());
  const [pendingFrom, setPendingFrom] = useState<string | null>(null);
  const [shown, setShown] = useState(false);
  const pending = pendingFrom === key;

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (!isInternalNavigation(event)) return;
      setPendingFrom(locationKey(window.location.pathname, new URLSearchParams(window.location.search).toString()));
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  useEffect(() => {
    if (!pending) return;
    const show = setTimeout(() => setShown(true), SHOW_DELAY_MS);
    const giveUp = setTimeout(() => setPendingFrom(null), GIVE_UP_MS);
    return () => {
      clearTimeout(show);
      clearTimeout(giveUp);
      setShown(false);
    };
  }, [pending]);

  return pending && shown;
}
