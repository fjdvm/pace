"use client";

import { Check } from "lucide-react";
import { PaceTag } from "@/components/features/student/shared/pace-tag";
import type { InstructorRequest } from "@/components/features/admin/types";
import { RequestRow } from "./request-row";
import { useInstructorReview } from "./use-instructor-review";

export function RequestsCard({ requests }: { requests: InstructorRequest[] }) {
  const { busyId, approve, decline } = useInstructorReview();

  return (
    <section className="overflow-hidden rounded-[20px] border-[1.5px] border-pace-line bg-white shadow-[0_3px_0_0_var(--color-pace-line)]">
      <header className="flex items-center gap-3 px-6 py-5">
        <h2 className="text-[22px] font-bold tracking-[-0.01em] text-pace-ink">Instructor requests</h2>
        {requests.length > 0 && <PaceTag tone="amber">{requests.length} waiting</PaceTag>}
      </header>
      {requests.length === 0 ? (
        <p className="border-t border-pace-line px-6 py-10 text-center text-sm text-pace-muted">
          You&apos;re all caught up. There are no instructor requests waiting.
        </p>
      ) : (
        <ul>
          {requests.map((request) => (
            <RequestRow key={request.id} request={request} busy={busyId === request.id} onApprove={approve} onDecline={decline} />
          ))}
        </ul>
      )}
      <p className="flex items-center gap-2 border-t border-pace-line px-6 py-4 text-xs text-pace-ink-2">
        <Check className="size-3.5 text-pace-green-deep" />
        Approved instructors can create classes right away.
      </p>
    </section>
  );
}
