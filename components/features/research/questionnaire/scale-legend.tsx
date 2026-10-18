import { LIKERT_LABELS } from "@/lib/study/questionnaire";

export function ScaleLegend() {
  return (
    <ul className="flex flex-wrap gap-2">
      {LIKERT_LABELS.map((label, index) => (
        <li key={label} className="pace-small flex items-center gap-2 rounded-full bg-pace-canvas px-3 py-1.5 text-pace-ink-2">
          <span className="font-bold text-pace-ink">{index + 1}</span>
          {label}
        </li>
      ))}
    </ul>
  );
}
