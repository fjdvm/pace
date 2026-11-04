"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";

export function GoogleSignInButton() {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string>();

  async function signIn() {
    setPending(true);
    setError(undefined);
    try {
      const { error } = await createClient().auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo: `${window.location.origin}/auth/callback` },
      });
      if (error) throw error;
    } catch {
      setError("Google sign-in could not start. Please try again.");
      setPending(false);
    }
  }

  return (
    <div className="w-full">
      <Button onClick={signIn} disabled={pending} aria-busy={pending}
        className="h-[50px] w-full gap-[10px] rounded-full border-0 bg-pace-ink text-[15px] font-semibold text-white hover:bg-pace-ink/90">
        <span className="flex size-[26px] shrink-0 items-center justify-center rounded-full bg-white">
          <Image src="/auth/google-sign-in/google.svg" width={16} height={16} alt="" />
        </span>
        {pending ? "Connecting to Google…" : "Continue with Google"}
      </Button>
      {error && <p role="alert" className="mt-3 text-center text-xs text-red-700">{error}</p>}
    </div>
  );
}
