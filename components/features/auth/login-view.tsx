"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { isEmailUnconfirmed } from "@/lib/auth-response";
import { toast } from "sonner";
import Link from "next/link";
import { AuthSplitLayout } from "./auth-split-layout";
import { AuthFormHeading } from "./auth-form-heading";
import { AuthField } from "./auth-field";
import { PasswordInput } from "./password-input";
import { AuthSubmitButton } from "./auth-submit-button";
import { AuthSwitchLink } from "./auth-switch-link";

export function LoginView() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    setIsLoading(true);
    try {
      const supabase = createClient();
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast.error(error.message);
      } else if (data?.user && isEmailUnconfirmed(data.user)) {
        await supabase.auth.signOut();
        toast.error("Please confirm your email before logging in. Check your inbox for the confirmation link.");
      } else if (data?.user) {
        const role = data.user.user_metadata?.role || "student";
        const approvalStatus =
          data.user.user_metadata?.approval_status || "approved";

        toast.success("Welcome back!");

        if (role === "instructor" && approvalStatus !== "approved") {
          router.push("/pending-approval");
        } else {
          router.push(`/dashboard/${role}`);
        }
        router.refresh();
      }
    } catch (err) {
      toast.error("An unexpected error occurred during login");
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
      <AuthFormHeading title="Log in to PACE" subtitle="Use the email you signed up with." />
      <form onSubmit={handleLogin} className="flex flex-col gap-6">
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
        <PasswordInput
          value={password}
          onChange={setPassword}
          disabled={isLoading}
          required
          showToggle
          aside={
            <Link href="/forgot-password" className="text-[13px] font-semibold text-pace-green-deep hover:underline">
              Forgot password?
            </Link>
          }
        />
        <AuthSubmitButton isLoading={isLoading} label="Log in" loadingLabel="Logging in..." />
      </form>
      <AuthSwitchLink prompt="New to PACE?" label="Create an account" href="/signup" />
    </AuthSplitLayout>
  );
}
