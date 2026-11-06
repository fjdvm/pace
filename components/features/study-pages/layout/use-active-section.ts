"use client";

import { useEffect, useState } from "react";

export function useActiveSection(ids: string[]) {
  const [active, setActive] = useState(ids[0]);

  useEffect(() => {
    const onScroll = () => {
      const passed = ids.filter((id) => (document.getElementById(id)?.getBoundingClientRect().top ?? 1) <= 120);
      setActive(passed.length ? passed[passed.length - 1] : ids[0]);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [ids]);

  return active;
}
