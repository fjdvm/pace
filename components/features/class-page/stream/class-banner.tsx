import { splitSection } from "@/lib/class-name";
import { classColour } from "@/lib/class-colour";
import { cn } from "@/lib/utils";
import { BannerDecoration } from "./banner-decoration";

type ClassBannerProps = {
  classId: string;
  name: string;
  instructorName: string;
  soft?: boolean;
};

export function ClassBanner({ classId, name, instructorName, soft }: ClassBannerProps) {
  const { title, section } = splitSection(name);
  return (
    <div
      style={soft ? undefined : { backgroundColor: classColour(classId) }}
      className={cn(
        "relative flex h-[120px] w-full flex-col gap-0.5 overflow-hidden rounded-lg pl-4 md:h-[220px] md:gap-1 md:pl-6",
        soft ? "justify-start bg-pace-green-tint pt-4 text-pace-ink md:pt-5" : "justify-end pb-[14px] text-white md:pb-5",
      )}
    >
      {soft && <BannerDecoration />}
      <p
        className={cn(
          "relative truncate leading-tight",
          soft
            ? "text-[24px] font-normal md:text-[40px]"
            : "text-[22px] font-bold tracking-[-0.01em] md:text-[32px] md:leading-[1.15] md:tracking-[-0.015em]",
        )}
      >
        {soft ? name : title}
      </p>
      {!soft && (
        <p className="truncate text-[13px] leading-normal md:text-lg">
          {section}
          <span className="hidden md:inline">
            {section && " · "}Prof. {instructorName.replace(/^prof\.?\s+/i, "")}
          </span>
        </p>
      )}
    </div>
  );
}
