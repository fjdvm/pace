"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { validatePasswordStrength } from "@/lib/password-policy";
import { isEmailAlreadyRegistered, isEmailUnconfirmed } from "@/lib/auth-response";
import { toast } from "sonner";
import { AuthSplitLayout } from "./auth-split-layout";
import { AuthFormHeading } from "./auth-form-heading";
import { AuthSubmitButton } from "./auth-submit-button";
import { AuthSwitchLink } from "./auth-switch-link";
import { RoleSelector, type AuthRole } from "./role-selector";
import { SignupFormFields } from "./signup-form-fields";
import { SignupLegalNotice } from "./signup-legal-notice";
import { SignupConfirmationSent } from "./signup-confirmation-sent";
import { InstructorReviewNote } from "./instructor-review-note";
import { SIGNUP_COPY } from "./signup-copy";

export function SignupView() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<AuthRole>("student");
  const [isLoading, setIsLoading] = useState(false);
  const [confirmationSentTo, setConfirmationSentTo] = useState<string | null>(null);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) {
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
      const approvalStatus = role === "instructor" ? "pending" : "approved";

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/login`,
          data: {
            name: name.trim(),
            role,
            approval_status: approvalStatus,
          },
        },
      });

      if (error) {
        toast.error(error.message);
      } else if (isEmailAlreadyRegistered(data?.user)) {
        toast.error("An account with this email already exists. Log in instead.");
      } else if (data?.user && isEmailUnconfirmed(data.user)) {
        setConfirmationSentTo(email);
      } else if (data?.user) {
        toast.success("Account created successfully!");
        setTimeout(() => {
          if (role === "instructor") {
            router.push("/pending-approval");
          } else {
            router.push("/dashboard/student");
          }
          router.refresh();
        }, 1000);
      }
    } catch (err) {
      toast.error("An unexpected error occurred during signup");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const copy = SIGNUP_COPY[role];

  return (
    <AuthSplitLayout headline={copy.headline} description={copy.description}>
      {confirmationSentTo ? (
        <SignupConfirmationSent email={confirmationSentTo} />
      ) : (
        <>
          <AuthFormHeading title={copy.title} subtitle={copy.subtitle} />
          <form onSubmit={handleSignup} className={`flex flex-col ${role === "instructor" ? "gap-5" : "gap-6"}`}>
            <RoleSelector role={role} isLoading={isLoading} onRoleChange={setRole} />
            <SignupFormFields
              name={name}
              onNameChange={setName}
              email={email}
              onEmailChange={setEmail}
              password={password}
              onPasswordChange={setPassword}
              isLoading={isLoading}
            />
            {role === "instructor" && <InstructorReviewNote />}
            <AuthSubmitButton isLoading={isLoading} label={copy.submit} loadingLabel={copy.loading} />
            <SignupLegalNotice action={copy.legalAction} />
          </form>
          <AuthSwitchLink prompt="Already have an account?" label="Log in" href="/login" />
        </>
      )}
    </AuthSplitLayout>
  );
}
