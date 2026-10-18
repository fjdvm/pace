"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { AuthSplitLayout } from "./auth-split-layout";
import { AuthFormHeading } from "./auth-form-heading";
import { AuthField } from "./auth-field";
import { AuthSubmitButton } from "./auth-submit-button";
import { AuthSwitchLink } from "./auth-switch-link";

export function ForgotPasswordView() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your email address");
      return;
    }

    setIsLoading(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        toast.error(error.message);
      } else {
        setIsSent(true);
      }
    } catch (err) {
      toast.error("An unexpected error occurred. Please try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthSplitLayout
      headline="Pick up where you left off."
      description="Your assignments, your code, and your tutor are waiting."
    >
      {isSent ? (
        <AuthFormHeading
          title="Check your inbox"
          subtitle={`We sent a password reset link to ${email}. Follow the link to choose a new password.`}
        />
      ) : (
        <>
          <AuthFormHeading
            title="Forgot your password?"
            subtitle="Enter your email and we’ll send you a link to reset it."
          />
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <AuthField
              label="Email"
              type="email"
              value={email}
              onValueChange={setEmail}
              disabled={isLoading}
              required
              autoComplete="email"
              placeholder="you@university.edu"
            />
            <AuthSubmitButton isLoading={isLoading} label="Send reset link" loadingLabel="Sending..." />
          </form>
        </>
      )}
      <AuthSwitchLink prompt="Remembered it?" label="Back to log in" href="/login" />
    </AuthSplitLayout>
  );
}
