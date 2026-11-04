"use client";

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { LogoutConfirmDialog } from "@/components/features/dashboard/logout-confirm-dialog";
import { getInitials } from "@/components/features/student/shared/initials-avatar";
import { useLogout } from "@/components/features/student/sidebar/use-logout";

type AccountMenuProps = {
  userEmail: string;
  userName?: string | null;
  isInstructor?: boolean;
  studentXp: { level: number; currentXp: number; nextThreshold: number };
};

export function AccountMenu({ userEmail, userName, isInstructor, studentXp }: AccountMenuProps) {
  const logout = useLogout();
  const displayName = userName || userEmail;
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger
          aria-label="Account"
          data-instructor={isInstructor}
          className="flex size-8 shrink-0 bg-pace-purple data-[instructor=true]:bg-pace-green-deep cursor-pointer items-center justify-center rounded-full text-[11px] font-bold uppercase leading-[1.3] tracking-[0.06em] text-white outline-none md:size-9"
        >
          {getInitials(displayName)}
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-64">
          <div className="flex flex-col gap-0.5 px-2 py-2">
            <span className="truncate text-[15px] font-bold text-pace-ink">{displayName}</span>
            <span className="truncate text-[13px] text-pace-muted">{userEmail}</span>
            <span className="pt-1 text-[13px] text-pace-ink-2">
              Level {studentXp.level} · {studentXp.currentXp} / {studentXp.nextThreshold} XP
            </span>
          </div>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => logout.setOpen(true)}>Sign out</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <LogoutConfirmDialog
        open={logout.open}
        onOpenChange={logout.setOpen}
        onConfirm={logout.confirmLogout}
        isLoggingOut={logout.isLoggingOut}
      />
    </>
  );
}
