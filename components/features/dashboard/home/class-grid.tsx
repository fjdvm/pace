import { ClassCard } from "./class-card";

type ClassGridProps = {
  title: "Teaching" | "Enrolled";
  classes: { id: string; name: string; instructorName: string }[];
};

export function ClassGrid({ title, classes }: ClassGridProps) {
  if (classes.length === 0) return null;
  return (
    <section aria-label={title} className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-6">
      {classes.map((cls) => (
        <ClassCard key={cls.id} {...cls} />
      ))}
    </section>
  );
}
