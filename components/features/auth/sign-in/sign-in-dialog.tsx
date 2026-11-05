"use client";

import { usePathname, useRouter } from "next/navigation";
import { Dialog as DialogPrimitive } from "@base-ui/react/dialog";
import { Dialog, DialogOverlay, DialogPortal } from "@/components/ui/dialog";
import { SignInContent } from "./sign-in-content";

type SignInDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function SignInDialog({ open, onOpenChange }: SignInDialogProps) {
  const pathname = usePathname();
  const router = useRouter();

  function handleOpenChange(next: boolean) {
    onOpenChange(next);
    if (!next && pathname === "/login") router.replace("/");
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogPortal>
        <DialogOverlay className="bg-pace-canvas/80 supports-backdrop-filter:backdrop-blur-sm" />
        <DialogPrimitive.Popup
          className="fixed top-1/2 left-1/2 z-50 w-[calc(100%-40px)] max-w-[350px] -translate-x-1/2 -translate-y-1/2 rounded-[20px] border border-pace-line bg-white px-6 pt-10 pb-6 text-pace-ink shadow-[0_4px_0_0_var(--color-pace-line)] outline-none duration-100 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95 sm:max-w-[440px] sm:px-8"
        >
          <SignInContent />
        </DialogPrimitive.Popup>
      </DialogPortal>
    </Dialog>
  );
}
