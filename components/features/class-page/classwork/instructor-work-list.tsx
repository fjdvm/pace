import type { InstructorAssignment } from "../types";
import { ClassworkRowMenu } from "./classwork-row-menu";
import { groupByWeek } from "./group-by-week";
import { WeekSection } from "./week-section";
import { instructorWorkMeta } from "./instructor-work-meta";
import { WorkRow } from "./work-row";

type InstructorWorkListProps = {
  items: InstructorAssignment[];
  onDelete: (item: InstructorAssignment) => void;
};

export function InstructorWorkList({ items, onDelete }: InstructorWorkListProps) {
  if (items.length === 0) {
    return <p className="py-10 text-center text-[13px] text-pace-ink-2">No work posted yet.</p>;
  }
  return (
    <>
      {groupByWeek(items).map((group) => (
        <WeekSection key={group.label} label={group.label}>
          {group.items.map((item) => (
            <WorkRow
              key={item.id}
              href={item.isDraft ? `/dashboard/assignments/${item.id}/edit` : `/dashboard/submissions/${item.id}`}
              title={item.title}
              meta={instructorWorkMeta(item)}
              menu={<ClassworkRowMenu assignmentId={item.id} onDelete={() => onDelete(item)} />}
            />
          ))}
        </WeekSection>
      ))}
    </>
  );
}
