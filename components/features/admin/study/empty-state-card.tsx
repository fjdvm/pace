import { QuestionnaireLink } from "./questionnaire-link";

export function EmptyStateCard({ path, closed }: { path: string; closed: boolean }) {
  return (
    <div className="flex flex-col items-start gap-3 rounded-[20px] border-[1.5px] border-pace-line bg-white p-6 shadow-[0_3px_0_0_var(--color-pace-line)]">
      <h2 className="text-lg font-bold text-pace-ink">No responses yet</h2>
      <p className="max-w-xl text-sm leading-relaxed text-pace-ink-2">
        {closed
          ? "The questionnaire is closed and nobody answered it. Reopen it to collect responses."
          : "Share the questionnaire link with students and instructors. Results appear here as soon as answers come in."}
      </p>
      <QuestionnaireLink path={path} />
    </div>
  );
}
