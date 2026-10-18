import { FileText, GraduationCap, Sparkles, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import type { AdminOverviewData } from "@/components/features/admin/types";

const cards = [
  { key: "students", label: "Students", Icon: Users, tone: "bg-pace-green-tint text-pace-green-deep" },
  { key: "instructors", label: "Instructors", Icon: GraduationCap, tone: "bg-pace-purple-tint text-pace-purple" },
  { key: "submissionsThisWeek", label: "Submissions this week", Icon: FileText, tone: "bg-pace-blue-tint text-pace-blue" },
  { key: "tutorQuestionsThisWeek", label: "Tutor questions this week", Icon: Sparkles, tone: "bg-pace-purple-tint text-pace-purple" },
] as const;

export function AdminStatCards({ counts }: { counts: AdminOverviewData["counts"] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map(({ key, label, Icon, tone }) => (
        <div
          key={key}
          className="flex items-center gap-3.5 rounded-[20px] border-[1.5px] border-pace-line bg-white p-5 shadow-[0_3px_0_0_var(--color-pace-line)]"
        >
          <span className={cn("flex size-11 shrink-0 items-center justify-center rounded-[14px]", tone)}>
            <Icon className="size-5" strokeWidth={1.75} />
          </span>
          <span className="flex min-w-0 flex-col">
            <span className="text-[26px] font-bold leading-tight text-pace-ink">{counts[key].toLocaleString()}</span>
            <span className="truncate text-[13px] text-pace-ink-2">{label}</span>
          </span>
        </div>
      ))}
    </div>
  );
}
