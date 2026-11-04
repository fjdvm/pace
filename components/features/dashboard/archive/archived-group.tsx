import { ClassCard } from "../home/class-card";
import { ClassActions } from "./class-actions";

type ArchivedGroupProps = {
  title: "Teaching" | "Enrolled";
  role: "instructor" | "student";
  classes: { id: string; name: string; instructorName: string; archived: boolean }[];
};

export function ArchivedGroup({ title, role, classes }: ArchivedGroupProps) {
  if (classes.length === 0) return null;
  return (
    <section aria-label={title} className="flex flex-col gap-3">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-pace-ink-2">{title}</h2>
      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-6">
        {classes.map((cls) => (
          <div key={cls.id} className="flex flex-col gap-2 sm:w-[296px]">
            <ClassCard id={cls.id} name={cls.name} instructorName={cls.instructorName} />
            <ClassActions cls={cls} role={role} />
          </div>
        ))}
      </div>
    </section>
  );
}
