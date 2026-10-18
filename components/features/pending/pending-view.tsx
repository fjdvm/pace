"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { landingFontClasses } from "@/components/features/landing/landing-fonts";
import { Wordmark } from "@/components/features/landing/shared/wordmark";
import { LogoutConfirmDialog } from "@/components/features/dashboard/logout-confirm-dialog";
import { PendingSteps } from "./pending-steps";
import { PendingActions } from "./pending-actions";

export function PendingView() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [declined, setDeclined] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  useEffect(() => {
    createClient()
      .auth.getUser()
      .then(({ data }) => {
        setEmail(data.user?.email ?? "");
        setDeclined(data.user?.user_metadata?.approval_status === "declined");
      });
  }, []);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
      toast.success("Logged out successfully");
      router.push("/login");
      router.refresh();
    } catch (err) {
      toast.error("Failed to log out");
      console.error(err);
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <div
      className={`${landingFontClasses} flex min-h-screen items-center justify-center bg-pace-canvas p-4 font-sans text-pace-ink`}
    >
      <main className="flex w-full max-w-[560px] flex-col gap-6 rounded-[20px] border-[1.5px] border-pace-line bg-white p-6 shadow-[0_4px_0_0_var(--color-pace-line)] sm:p-10">
        <Wordmark />
        <h1 className="text-[32px] font-bold leading-[1.15] tracking-[-0.48px]">
          {declined ? "Your instructor request was not approved" : "Your instructor account is almost ready"}
        </h1>
        <p className="text-[15px] leading-[1.55] text-pace-ink-2">
          {declined
            ? "An administrator reviewed your request and could not approve it. If you think this is a mistake, contact the administrator."
            : "An administrator checks every instructor account before it can create classes. This keeps student data safe."}
        </p>
        {!declined && <PendingSteps email={email} />}
        <PendingActions
          disabled={isLoggingOut}
          isLoggingOut={isLoggingOut}
          onLogout={() => setShowLogoutConfirm(true)}
        />
      </main>

      <LogoutConfirmDialog
        open={showLogoutConfirm}
        onOpenChange={setShowLogoutConfirm}
        onConfirm={handleLogout}
        isLoggingOut={isLoggingOut}
      />
    </div>
  );
}
