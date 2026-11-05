import { PaceTag } from "@/components/features/student/shared/pace-tag";
import { buildItemActivity } from "@/lib/insights/activity";
import { formatClock } from "@/lib/insights/format";
import { flagLabel, flagTone, itemRisk } from "@/lib/insights/item-risk";
import type { SubmissionDetail } from "@/components/features/instructor/submissions/detail/types";
import { ActivityStat } from "./insights/activity-stat";
import { LogDot } from "./insights/log-dot";

const mobileKinds = ["away", "paste", "submit"];

export function ReviewActivity({
  detail,
  item,
  firstItemId,
}: {
  detail: SubmissionDetail;
  item: { id: string; code: string; language: string };
  firstItemId: string;
}) {
  const signals = detail.signals;
  const events = signals?.events ?? [];
  const fileName = item.language === "Python" ? "main.py" : "main";
  const activity = buildItemActivity({
    events,
    legacyKeystrokes: signals?.keystrokeCount ?? 0,
    tutorQuestions: detail.chat
      .filter((m) => m.role === "user" && m.itemId === item.id)
      .map((m) => Date.parse(m.createdAt)),
    itemId: item.id,
    firstItemId,
    fileName,
    finalCodeLength: item.code.length,
  });
  const flag = itemRisk(events, item.id, firstItemId, item.code.length, activity.typed).flag;
  return (
    <section className="flex flex-col gap-2.5 rounded-[8px] border border-pace-line bg-white px-3.5 py-3 md:gap-3.5 md:px-5 md:pb-6 md:pt-5">
      <div className="flex items-center justify-between">
        <h2 className="text-[15px] font-bold md:text-base">How this code was written</h2>
        <span className="hidden md:block">
          <PaceTag tone={flagTone(flag)}>
            Activity: {flagLabel(flag)}
          </PaceTag>
        </span>
      </div>
      <div className="flex flex-wrap gap-5 md:gap-8">
        <ActivityStat desktopOnly value={String(activity.typed)} label="characters typed" />
        <ActivityStat
          value={<><span className="md:hidden">{activity.pastePercent}%</span><span className="hidden md:inline">{activity.pasted}</span></>}
          label={<><span className="md:hidden">pasted</span><span className="hidden md:inline">characters pasted ({activity.pastePercent}%)</span></>}
        />
        <ActivityStat
          value={String(activity.tabLeaves)}
          label={<><span className="md:hidden">tab switches</span><span className="hidden md:inline">times left the tab</span></>}
        />
        <ActivityStat
          value={`${Math.round(activity.awaySecs / 60)} min`}
          label={<><span className="md:hidden">away</span><span className="hidden md:inline">away from the tab</span></>}
        />
      </div>
      <ol className="flex flex-col">
        {activity.log.map((entry, i) => (
          <li
            key={i}
            className={`items-center gap-2.5 py-1 text-[13px] md:flex md:gap-3 md:py-1.5 ${mobileKinds.includes(entry.kind) ? "flex" : "hidden"}`}
          >
            <time className="shrink-0 text-pace-muted md:w-[70px]">{formatClock(entry.at)}</time>
            <LogDot tone={entry.tone} className="size-2 md:size-2.5" />
            <span>{entry.text}</span>
          </li>
        ))}
      </ol>
      <p className="text-[11px] font-bold uppercase tracking-[0.66px] text-pace-muted md:text-[13px] md:font-normal md:normal-case md:tracking-normal md:text-pace-ink-2">
        <span className="md:hidden">Worth a closer look, not proof of copying.</span>
        <span className="hidden md:inline">
          A flag means this work is worth a closer look. It is not proof of
          copying. Ask the Student to explain their code if you have doubts.
        </span>
      </p>
    </section>
  );
}
