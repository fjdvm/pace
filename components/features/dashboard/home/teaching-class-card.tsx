import Image from "next/image";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import type { TeachingHomeClass } from "@/app/actions/teaching-home";
import { classColour } from "@/lib/class-colour";
import { splitSection } from "@/lib/class-name";
import { getInitials } from "@/components/features/student/shared/initials-avatar";
import { TeachingClassMenu } from "./teaching-class-menu";

export function TeachingClassCard({ cls }: { cls: TeachingHomeClass }) {
  const colour = classColour(cls.id);
  const { title, section } = splitSection(cls.name);
  const firstReview = cls.reviews[0];
  const reviewUrl = firstReview ? `/dashboard/submissions/${firstReview.assignmentId}` : "/dashboard/submissions";
  const classUrl = `/dashboard/classes/${cls.id}`;
  return (
    <Card className="relative w-full gap-0 rounded-[8px] border-0 border-pace-line sm:border bg-white py-0 text-pace-ink ring-0 sm:h-[292px] sm:w-[296px]">
      <Link href={classUrl} style={{ backgroundColor: colour }} className="flex h-[120px] shrink-0 flex-col gap-0.5 px-4 py-3.5 text-white outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-white sm:h-[100px] sm:pb-3.5 sm:pt-4">
        <p className="truncate pr-6 text-xl font-bold leading-[1.25] tracking-[-0.2px] sm:pr-0">{title}</p>
        <p className="truncate text-[13px] leading-[1.5]">{section && `${section} · `}{cls.studentCount} {cls.studentCount === 1 ? "student" : "students"}</p>
        <span className="flex-1" />
        <p className="hidden truncate text-[13px] leading-[1.5] sm:block">Prof. {cls.instructorName.replace(/^prof\.?\s+/i, "")}</p>
        <p className="text-[13px] leading-[1.5] sm:hidden">{cls.reviewCount ? `${cls.reviewCount} to review` : "Nothing to review"}</p>
      </Link>
      <div className="hidden min-h-0 flex-1 flex-col gap-1 px-4 pt-7 text-[13px] leading-[1.5] sm:flex">
        <p className="text-pace-muted">{firstReview ? "To review" : "Nothing to review"}</p>
        {firstReview && <Link href={reviewUrl} className="line-clamp-2 hover:underline">{firstReview.count} turned in – {firstReview.title}</Link>}
      </div>
      <div className="hidden h-[52px] shrink-0 items-center justify-end gap-1 border-t border-pace-line px-2 sm:flex">
        <Link href={reviewUrl} aria-label={`Review ${cls.name}`} className="flex size-10 items-center justify-center rounded-full hover:bg-pace-sunken">
          <Image src="/instructor-home/chart.svg" alt="" width={24} height={24} />
        </Link>
        <Link href={`${classUrl}?tab=classwork`} aria-label={`Classwork for ${cls.name}`} className="flex size-10 items-center justify-center rounded-full hover:bg-pace-sunken">
          <Image src="/instructor-home/folder.svg" alt="" width={24} height={24} />
        </Link>
      </div>
      <span aria-hidden style={{ backgroundColor: colour }} className="absolute right-4 top-[65px] hidden size-16 items-center justify-center rounded-full border-[3px] border-white text-[22px] font-bold leading-[1.35] tracking-[-0.11px] text-white sm:flex">{getInitials(cls.instructorName)}</span>
      <TeachingClassMenu cls={cls} />
    </Card>
  );
}
