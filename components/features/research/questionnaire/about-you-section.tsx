import { cn } from "@/lib/utils";
import { AI_USAGE_OPTIONS, COURSE_COUNTS, YEAR_LEVELS, type QuestionnaireVersion } from "@/lib/study/questionnaire";
import type { AboutYou } from "@/lib/study/form-progress";
import { PartCard } from "./part-card";

type AboutYouSectionProps = {
  version: QuestionnaireVersion;
  value: AboutYou;
  onChange: (patch: Partial<AboutYou>) => void;
};

const select =
  "pace-body h-[55px] w-full cursor-pointer rounded-xl border-[1.5px] border-pace-line bg-white px-4 text-pace-ink outline-none focus:border-pace-ink";

function SelectField({ id, label, value, options, onChange }: { id: string; label: string; value: string; options: string[]; onChange: (v: string) => void }) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="pace-body font-semibold text-pace-ink">
        {label}
      </label>
      <select id={id} value={value} onChange={(e) => onChange(e.target.value)} className={select}>
        <option value="" disabled>
          Select one
        </option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </div>
  );
}

export function AboutYouSection({ version, value, onChange }: AboutYouSectionProps) {
  return (
    <PartCard part="Part I" title="About you">
      {version === "student" && (
        <div className="grid gap-4 sm:grid-cols-2">
          <SelectField id="year-level" label="Year level" value={value.yearLevel} options={YEAR_LEVELS} onChange={(yearLevel) => onChange({ yearLevel })} />
          <SelectField
            id="courses-taken"
            label="Programming courses taken"
            value={value.coursesTaken}
            options={COURSE_COUNTS}
            onChange={(coursesTaken) => onChange({ coursesTaken })}
          />
        </div>
      )}
      <div role="radiogroup" aria-labelledby="ai-usage-label" className="flex flex-col gap-3">
        <p id="ai-usage-label" className="pace-body font-semibold text-pace-ink">
          How often do you use AI tools like ChatGPT for programming?
        </p>
        <div className="flex flex-wrap gap-2">
          {AI_USAGE_OPTIONS.map((option) => (
            <button
              key={option.id}
              type="button"
              role="radio"
              aria-checked={value.aiUsage === option.id}
              onClick={() => onChange({ aiUsage: option.id })}
              className={cn(
                "pace-body cursor-pointer rounded-xl border-[1.5px] px-5 py-3 font-semibold",
                value.aiUsage === option.id
                  ? "border-pace-ink bg-pace-ink text-white"
                  : "border-pace-line bg-white text-pace-ink",
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>
    </PartCard>
  );
}
