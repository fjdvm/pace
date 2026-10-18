import { Button } from "@/components/ui/button";

type PendingActionsProps = {
  disabled: boolean;
  isLoggingOut: boolean;
  onLogout: () => void;
};

export function PendingActions({ disabled, isLoggingOut, onLogout }: PendingActionsProps) {
  const contactEmail = process.env.NEXT_PUBLIC_ADMIN_CONTACT_EMAIL;

  return (
    <div className="flex gap-3">
      <Button
        onClick={onLogout}
        disabled={disabled}
        className="h-10 cursor-pointer rounded-full border-[1.5px] border-pace-line-strong bg-white px-[18px] text-sm font-bold text-pace-ink shadow-[0_3px_0_0_var(--color-pace-line-strong)] hover:bg-pace-canvas"
      >
        {isLoggingOut ? "Logging out..." : "Log out"}
      </Button>
      {contactEmail && (
        <Button
          variant="ghost"
          nativeButton={false}
          render={<a href={`mailto:${contactEmail}`} />}
          className="h-10 rounded-full px-[18px] text-sm font-bold text-pace-ink hover:bg-pace-sunken"
        >
          Contact admin
        </Button>
      )}
    </div>
  );
}
