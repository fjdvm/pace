"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface LogoutConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  isLoggingOut?: boolean;
}

export function LogoutConfirmDialog({ open, onOpenChange, onConfirm, isLoggingOut }: LogoutConfirmDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="gap-6 rounded-[20px] border-[1.5px] border-pace-line bg-white p-6 text-pace-ink shadow-[0_4px_0_0_var(--color-pace-line)] ring-0 data-[size=default]:sm:max-w-md">
        <AlertDialogHeader className="gap-2 text-left">
          <AlertDialogTitle className="text-2xl font-bold leading-[1.15] tracking-[-0.48px]">
            Log out?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-[15px] leading-[1.55] text-pace-ink-2">
            You&apos;ll need to log back in to access your dashboard.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="m-0 flex-row justify-end gap-3 border-0 bg-transparent p-0">
          <AlertDialogCancel
            disabled={isLoggingOut}
            className="h-10 cursor-pointer rounded-full border-[1.5px] border-pace-line-strong bg-white px-[18px] text-sm font-bold text-pace-ink shadow-[0_3px_0_0_var(--color-pace-line-strong)] hover:bg-pace-canvas"
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            disabled={isLoggingOut}
            className="h-10 cursor-pointer rounded-full bg-pace-ink px-5 text-sm font-bold text-white hover:bg-pace-ink/85"
          >
            {isLoggingOut ? "Logging out..." : "Log out"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
