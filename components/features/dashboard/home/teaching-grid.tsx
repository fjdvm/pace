import type { TeachingHomeClass } from "@/app/actions/teaching-home";
import { TeachingClassCard } from "./teaching-class-card";
import { CreateClassButton } from "./create-class-button";

export function TeachingGrid({ classes }: { classes: TeachingHomeClass[] }) {
  return (
    <>
      <section aria-label="Teaching" className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-6">
        {classes.map((cls) => <TeachingClassCard key={cls.id} cls={cls} />)}
      </section>
      <CreateClassButton />
    </>
  );
}
