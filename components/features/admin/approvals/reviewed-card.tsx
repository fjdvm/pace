import { InitialsAvatar } from "@/components/features/student/shared/initials-avatar";
import { PaceTag } from "@/components/features/student/shared/pace-tag";
import type { InstructorRequest } from "@/components/features/admin/types";

export function ReviewedCard({ instructors }: { instructors: InstructorRequest[] }) {
  return (
    <section className="overflow-hidden rounded-[20px] border-[1.5px] border-pace-line bg-white shadow-[0_3px_0_0_var(--color-pace-line)]">
      <header className="px-6 py-5">
        <h2 className="text-[22px] font-bold tracking-[-0.01em] text-pace-ink">Reviewed instructors</h2>
      </header>
      {instructors.length === 0 ? (
        <p className="border-t border-pace-line px-6 py-10 text-center text-sm text-pace-muted">
          Instructors you approve or decline will show up here.
        </p>
      ) : (
        <ul>
          {instructors.map((instructor) => (
            <li key={instructor.id} className="flex items-center gap-3 border-t border-pace-line px-6 py-3.5">
              <InitialsAvatar name={instructor.name} tone="purple" className="size-9" />
              <div className="flex min-w-0 flex-1 flex-col">
                <span className="truncate text-sm font-semibold text-pace-ink">{instructor.name}</span>
                <span className="truncate text-xs text-pace-muted">{instructor.email}</span>
              </div>
              <PaceTag tone={instructor.status === "approved" ? "green" : "red"}>
                {instructor.status === "approved" ? "Approved" : "Declined"}
              </PaceTag>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
