import type { QuestionnaireVersion } from "@/lib/study/questionnaire";
import { VersionToggle } from "./version-toggle";

type QuestionnaireHeaderProps = {
  version: QuestionnaireVersion;
  onVersionChange: (version: QuestionnaireVersion) => void;
};

export function QuestionnaireHeader({ version, onVersionChange }: QuestionnaireHeaderProps) {
  return (
    <header className="flex flex-col items-start gap-5">
      <p className="pace-eyebrow text-pace-green-deep">Research</p>
      <h1 className="pace-h2 max-w-[730px] text-pace-ink">Evaluation questionnaire</h1>
      <p className="pace-body-l max-w-[760px] text-pace-ink-2">
        You’ve tried PACE. Now tell us what you think. Rate each statement based on your own experience. There are no
        right or wrong answers.
      </p>
      <VersionToggle value={version} onChange={onVersionChange} />
    </header>
  );
}
