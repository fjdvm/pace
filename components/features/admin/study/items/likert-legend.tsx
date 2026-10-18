import { LIKERT_LABELS } from "@/lib/study/questionnaire";
import { likertFills } from "./likert-colors";

export function LikertLegend() {
  return (
    <ul className="flex flex-wrap items-center gap-x-4 gap-y-1">
      {LIKERT_LABELS.map((label, i) => (
        <li key={label} className="flex items-center gap-1.5 text-xs text-pace-ink-2">
          <span className={`size-2.5 rounded-[3px] ${likertFills[i]}`} />
          {label}
        </li>
      ))}
    </ul>
  );
}
