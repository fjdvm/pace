import type { StudentAssignment } from "@/components/features/student/types";
import { groupByWeek } from "./group-by-week";
import { ViewYourWork } from "./view-your-work";
import { WeekSection } from "./week-section";

export function StudentClasswork({ items }: { items: StudentAssignment[] }) {
  if (items.length === 0) {
    return <p className="py-10 text-center text-[13px] text-pace-ink-2">No work posted yet.</p>;
  }
  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
      <ViewYourWork />
      {groupByWeek(items).map((group) => (
        <WeekSection key={group.label} label={group.label} items={group.items} />
      ))}
    </div>
  );
}
