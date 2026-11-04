import { PaceTag } from "@/components/features/student/shared/pace-tag";

export function MobileTags({ language, hearts }: { language: string; hearts: number }) {
  return (
    <div className="flex gap-2 md:hidden">
      <PaceTag tone="neutral" className="capitalize">{language}</PaceTag>
      <PaceTag tone="red">{hearts} hearts</PaceTag>
    </div>
  );
}
