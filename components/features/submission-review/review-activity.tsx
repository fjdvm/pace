import type { SubmissionDetail } from "@/components/features/instructor/submissions/detail/types";
import { PaceTag } from "@/components/features/student/shared/pace-tag";

export function ReviewActivity({ detail }: { detail: SubmissionDetail }) {
  const signals = detail.signals;
  const typed = signals?.keystrokeCount ?? 0;
  const pasted = signals?.pasteLength ?? 0;
  const percent = Math.round((pasted / Math.max(1, typed + pasted)) * 100);
  const away = (signals?.events ?? []).reduce(
    (sum, e) => sum + (e.type === "tab_switch" ? e.awayDurationSecs : 0),
    0,
  );
  const flag = signals?.riskScore?.flag ?? "Low";
  return (
    <section className="flex flex-col gap-3.5 rounded-[8px] border border-pace-line bg-white px-5 pb-6 pt-5 max-md:p-3.5">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-bold">How this code was written</h2>
        <span className="hidden md:block">
          <PaceTag
            tone={
              flag === "High" ? "red" : flag === "Medium" ? "amber" : "neutral"
            }
          >
            Activity: {flag}
          </PaceTag>
        </span>
      </div>
      <div className="flex flex-wrap gap-5 md:gap-8">
        <div className="hidden md:block">
          <b className="text-[22px]">{typed}</b>
          <p className="text-[13px] text-pace-muted">characters typed</p>
        </div>
        <div>
          <b className="text-base md:text-[22px]">
            <span className="md:hidden">{percent}%</span>
            <span className="hidden md:inline">{pasted}</span>
          </b>
          <p className="text-[11px] font-bold uppercase tracking-[0.66px] text-pace-muted md:text-[13px] md:font-normal md:normal-case md:tracking-normal">
            <span className="md:hidden">Pasted</span>
            <span className="hidden md:inline">
              characters pasted ({percent}%)
            </span>
          </p>
        </div>
        <div>
          <b className="text-base md:text-[22px]">
            {signals?.tabSwitchCount ?? 0}
          </b>
          <p className="text-[11px] font-bold uppercase tracking-[0.66px] text-pace-muted md:text-[13px] md:font-normal md:normal-case md:tracking-normal">
            tab switches
          </p>
        </div>
        <div>
          <b className="text-base md:text-[22px]">
            {Math.round(away / 60)} min
          </b>
          <p className="text-[11px] font-bold uppercase tracking-[0.66px] text-pace-muted md:text-[13px] md:font-normal md:normal-case md:tracking-normal">
            away
          </p>
        </div>
      </div>
      <ol className="flex flex-col gap-3 text-[13px]">
        {(signals?.events ?? [])
          .filter((e) =>
            ["paste", "tab_switch", "submit", "run_attempt"].includes(e.type),
          )
          .map((e, i) => (
            <li key={i} className="flex items-center gap-3">
              <time className="w-[70px] shrink-0 text-pace-muted">
                {new Date(e.timestamp).toLocaleTimeString("en-US", {
                  hour: "numeric",
                  minute: "2-digit",
                })}
              </time>
              <span
                className={`size-2.5 shrink-0 rounded-full ${e.type === "paste" ? "bg-pace-red" : e.type === "tab_switch" ? "bg-pace-amber" : "bg-pace-green"}`}
              />
              <span>
                {e.type === "paste"
                  ? `Pasted ${e.length} characters`
                  : e.type === "tab_switch"
                    ? `Left the tab for ${Math.round(e.awayDurationSecs / 60)} min`
                    : e.type === "run_attempt"
                      ? `Ran tests · ${e.passedCount} of ${e.totalCount} passed`
                      : "Turned in"}
              </span>
            </li>
          ))}
      </ol>
      <p className="text-[11px] font-bold uppercase tracking-[0.66px] text-pace-muted md:text-[13px] md:font-normal md:normal-case md:tracking-normal md:text-pace-ink-2">
        <span className="md:hidden">
          Worth a closer look, not proof of copying.
        </span>
        <span className="hidden md:inline">
          A flag means this work is worth a closer look. It is not proof of
          copying. Ask the Student to explain their code if you have doubts.
        </span>
      </p>
    </section>
  );
}
