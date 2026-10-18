import { useEffect, useRef, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";

const MIN_VISIBLE_MS = 1500;
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
  const [visible, setVisible] = useState(false);
  const startedAt = useRef(0);
  const arrived = pendingFrom !== null && pendingFrom !== key;

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (!isInternalNavigation(event)) return;
      startedAt.current = Date.now();
      setPendingFrom(locationKey(window.location.pathname, new URLSearchParams(window.location.search).toString()));
      setVisible(true);
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  useEffect(() => {
    if (!arrived) return;
    const remaining = Math.max(0, MIN_VISIBLE_MS - (Date.now() - startedAt.current));
    const hide = setTimeout(() => {
      setVisible(false);
      setPendingFrom(null);
    }, remaining);
    return () => clearTimeout(hide);
  }, [arrived]);

  useEffect(() => {
    if (pendingFrom === null) return;
    const giveUp = setTimeout(() => {
      setVisible(false);
      setPendingFrom(null);
    }, GIVE_UP_MS);
    return () => clearTimeout(giveUp);
  }, [pendingFrom]);

  return visible;
}
