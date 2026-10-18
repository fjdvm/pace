import { PaceIcon } from "@/components/features/student/shared/pace-icon";
import type { TestRunResult } from "@/components/features/assignments/types";

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex min-w-0 flex-col gap-0.5">
      <span className="text-[11px] font-bold uppercase leading-snug tracking-[0.06em] text-pace-muted">{label}</span>
      <span className="whitespace-pre-wrap font-mono text-[13px] font-bold leading-[22px] text-pace-ink">
        {value || "(empty)"}
      </span>
    </div>
  );
}

export function FailedTestCard({ index, result }: { index: number; result: TestRunResult }) {
  return (
    <div className="flex flex-col gap-2 rounded-[14px] bg-pace-red-tint p-3.5">
      <div className="flex items-center gap-2 text-[13px] font-bold text-pace-red">
        <PaceIcon name="workspace/x" size={16} />
        Test {index} failed
      </div>
      <div className="flex flex-wrap gap-x-6 gap-y-2">
        <Field label="Input" value={result.input.replace(/\n/g, " / ")} />
        <Field label="Expected" value={result.expectedOutput} />
        <Field label="Your output" value={result.actualOutput.trim()} />
      </div>
    </div>
  );
}
