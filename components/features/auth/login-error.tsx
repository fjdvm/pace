"use client";

import { useSearchParams } from "next/navigation";

export function LoginError() {
  const searchParams = useSearchParams();
  if (!searchParams.has("error")) return null;
  return (
    <p role="alert" className="text-center text-xs text-red-700">
      We couldn’t complete Google sign-in. Please try again.
    </p>
  );
}
