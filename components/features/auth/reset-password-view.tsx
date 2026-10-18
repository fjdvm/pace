"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { validatePasswordStrength } from "@/lib/password-policy";
import { toast } from "sonner";
import { AuthSplitLayout } from "./auth-split-layout";
import { AuthFormHeading } from "./auth-form-heading";
import { PasswordInput } from "./password-input";
import { PasswordChecklist } from "./password-checklist";
import { AuthSubmitButton } from "./auth-submit-button";

export function ResetPasswordView() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    const { data: listener } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") setIsReady(true);
    });
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) setIsReady(true);
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) {
      toast.error("Please fill in all fields");
      return;
    }
    const passwordCheck = validatePasswordStrength(password);
    if (!passwordCheck.valid) {
      toast.error(passwordCheck.error);
      return;
    }

    setIsLoading(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.updateUser({ password });

      if (error) {
        toast.error(error.message);
      } else {
        toast.success("Password updated successfully!");
        router.push("/login");
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
      {!isReady ? (
        <p className="text-[15px] leading-[1.55] text-pace-ink-2">Verifying your reset link...</p>
      ) : (
        <>
          <AuthFormHeading
            title="Set a new password"
            subtitle="Choose a strong password to secure your account."
          />
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <PasswordInput
              label="New password"
              value={password}
              onChange={setPassword}
              disabled={isLoading}
              required
              showToggle
            >
              <PasswordChecklist password={password} />
            </PasswordInput>
            <AuthSubmitButton isLoading={isLoading} label="Update password" loadingLabel="Updating..." />
          </form>
        </>
      )}
    </AuthSplitLayout>
  );
}
