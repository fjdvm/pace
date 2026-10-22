"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

export function ResendConfirmation({ email }: { email: string }) {
  const [isSending, setIsSending] = useState(false);

  const handleResend = async () => {
    setIsSending(true);
    try {
      const { error } = await createClient().auth.resend({
        type: "signup",
        email,
        options: { emailRedirectTo: `${window.location.origin}/login` },
      });
      if (error) {
        toast.error(error.message);
      } else {
        toast.success(`Confirmation email sent to ${email}`);
      }
    } catch {
      toast.error("Could not resend the confirmation email");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <p className="text-[14px] leading-[1.55] text-pace-ink-2">
      Didn&apos;t get the email or the link expired?{" "}
      <button
        type="button"
        onClick={handleResend}
        disabled={isSending}
        className="font-bold text-pace-ink hover:underline disabled:opacity-60"
      >
        {isSending ? "Sending..." : "Resend confirmation email"}
      </button>
    </p>
  );
}
