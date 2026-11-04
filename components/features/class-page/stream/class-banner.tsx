import { splitSection } from "@/lib/class-name";
import { classColour } from "@/lib/class-colour";

type ClassBannerProps = {
  classId: string;
  name: string;
  instructorName: string;
};

export function ClassBanner({ classId, name, instructorName }: ClassBannerProps) {
  const { title, section } = splitSection(name);
  return (
    <div
      style={{ backgroundColor: classColour(classId) }}
      className="flex h-[120px] w-full flex-col justify-end gap-0.5 rounded-lg pb-[14px] pl-4 text-white md:h-[220px] md:gap-1 md:pb-5 md:pl-6"
    >
      <p className="truncate text-[22px] font-bold leading-tight tracking-[-0.01em] md:text-[32px] md:leading-[1.15] md:tracking-[-0.015em]">{title}</p>
      <p className="truncate text-[13px] leading-normal md:text-lg">
        {section}
        <span className="hidden md:inline">
          {section && " · "}Prof. {instructorName.replace(/^prof\.?\s+/i, "")}
        </span>
      </p>
    </div>
  );
}
