"use client";

import { useEffect, useState } from "react";

export function useScrollState(targetSelector: string) {
  const [scrolled, setScrolled] = useState(false);
  const [targetGone, setTargetGone] = useState(false);

  useEffect(() => {
    const update = () => {
      setScrolled(window.scrollY > 8);
      const target = document.querySelector(targetSelector);
      setTargetGone(target ? target.getBoundingClientRect().bottom < 0 : false);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [targetSelector]);

  return { scrolled, targetGone };
}
