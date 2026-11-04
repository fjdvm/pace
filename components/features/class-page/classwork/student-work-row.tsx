import type { StudentAssignment } from "@/components/features/student/types";
import { RowMenu } from "../stream/row-menu";
import { statusLabel } from "./student-work-status";
import { WorkRow } from "./work-row";

export function StudentWorkRow({ item }: { item: StudentAssignment }) {
  const href = `/dashboard/assignments/${item.id}`;
  return (
    <WorkRow
      href={href}
      title={item.title}
      meta={statusLabel(item, true)}
      menu={
        <div className="relative z-10">
          <RowMenu href={href} />
        </div>
      }
    />
  );
}
