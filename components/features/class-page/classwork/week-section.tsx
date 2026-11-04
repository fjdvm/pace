import type { StudentAssignment } from "@/components/features/student/types";
import { StudentWorkRow } from "./student-work-row";

type WeekSectionProps = { label: string; items: StudentAssignment[] };

export function WeekSection({ label, items }: WeekSectionProps) {
  return (
    <section className="flex flex-col">
      <h2 className="border-b border-solid [border-bottom-color:var(--color-pace-green)] pb-2 text-[20px] font-bold leading-tight text-pace-green-deep">{label}</h2>
      {items.map((item) => (
        <StudentWorkRow key={item.id} item={item} />
      ))}
    </section>
  );
}
