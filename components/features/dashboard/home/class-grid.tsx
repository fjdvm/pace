import { ClassCard } from "./class-card";
import { EnrolledClassMenu } from "./enrolled-class-menu";

type ClassGridProps = {
  title: "Teaching" | "Enrolled";
  classes: { id: string; name: string; instructorName: string }[];
};

export function ClassGrid({ title, classes }: ClassGridProps) {
  if (classes.length === 0) return null;
  return (
    <section aria-label={title} className="flex flex-col gap-3 sm:max-w-[1256px] sm:flex-row sm:flex-wrap sm:gap-6">
      {classes.map((cls) => (
        <ClassCard key={cls.id} {...cls} menu={title === "Enrolled" ? <EnrolledClassMenu id={cls.id} name={cls.name} /> : undefined} />
      ))}
    </section>
  );
}
