import { ClassCard } from "./class-card";
import { EnrolledClassMenu } from "./enrolled-class-menu";

type ClassGridProps = {
  title: "Teaching" | "Enrolled";
  classes: { id: string; name: string; instructorName: string; todoCount?: number }[];
};

export function ClassGrid({ title, classes }: ClassGridProps) {
  if (classes.length === 0) return null;
  return (
    <section aria-label={title} className="flex flex-col gap-3 sm:mx-auto sm:w-full sm:max-w-7xl sm:flex-row sm:flex-wrap sm:gap-4">
      {classes.map((cls) => (
        <ClassCard key={cls.id} {...cls} summary={title === "Enrolled" ? `${cls.todoCount ?? 0} to do` : undefined} menu={title === "Enrolled" ? <EnrolledClassMenu id={cls.id} name={cls.name} /> : undefined} />
      ))}
    </section>
  );
}
