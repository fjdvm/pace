"use client";

import { useEffect, useState } from "react";

export function useRelativeTime(timestamp: number | null) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (!timestamp) return;
    const id = setInterval(() => setNow(Date.now()), 5000);
    return () => clearInterval(id);
  }, [timestamp]);

  if (!timestamp) return "";
  const seconds = Math.max(0, Math.round((now - timestamp) / 1000));
  if (seconds < 60) return `${seconds} sec ago`;
  return `${Math.floor(seconds / 60)} min ago`;
}
