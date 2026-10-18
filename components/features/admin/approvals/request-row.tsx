import { InitialsAvatar } from "@/components/features/student/shared/initials-avatar";
import { PaceActionButton } from "@/components/features/student/shared/pace-action-button";
import { formatRelative } from "@/lib/relative-time";
import type { InstructorRequest } from "@/components/features/admin/types";

type RequestRowProps = {
  request: InstructorRequest;
  busy: boolean;
  onApprove: (id: string) => void;
  onDecline: (id: string) => void;
};

export function RequestRow({ request, busy, onApprove, onDecline }: RequestRowProps) {
  return (
    <li className="flex flex-wrap items-center gap-3 border-t border-pace-line px-6 py-4">
      <InitialsAvatar name={request.name} tone="purple" className="size-9" />
      <div className="flex min-w-0 flex-1 flex-col">
        <span className="truncate text-sm font-semibold text-pace-ink">{request.name}</span>
        <span className="truncate text-xs text-pace-muted">
          {request.email} · Requested {formatRelative(request.createdAt)}
        </span>
      </div>
      <PaceActionButton variant="ghost" disabled={busy} onClick={() => onDecline(request.id)}>
        Decline
      </PaceActionButton>
      <PaceActionButton variant="green" disabled={busy} onClick={() => onApprove(request.id)}>
        Approve
      </PaceActionButton>
    </li>
  );
}
