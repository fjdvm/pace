import type { TeachingHomeClass } from "@/app/actions/teaching-home";
import { ClassCard } from "./class-card";
import { TeachingClassMenu } from "./teaching-class-menu";

export function TeachingClassCard({ cls }: { cls: TeachingHomeClass }) {
  return <ClassCard id={cls.id} name={cls.name} instructorName={cls.instructorName} summary={`${cls.reviewCount} to review`} menu={<TeachingClassMenu cls={cls} />} />;
}
