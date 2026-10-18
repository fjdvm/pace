import Link from "next/link";
import { Check } from "lucide-react";
import type { SubmittedSummary } from "./use-submitted-summary";

const chip = "pace-small rounded-full px-3 py-1.5 font-semibold";

export function SubmittedCard({ summary }: { summary: SubmittedSummary }) {
  return (
    <div className="mx-auto flex w-full max-w-[620px] flex-col items-center gap-6 rounded-[28px] border-[1.5px] border-pace-line bg-white px-8 py-14 text-center shadow-[0_4px_0_0_var(--color-pace-line)]">
      <span className="flex size-20 items-center justify-center rounded-3xl bg-pace-green text-white">
        <Check className="size-9" strokeWidth={3} />
      </span>
      <h1 className="pace-h3 text-pace-ink">Thank you for helping us evaluate PACE</h1>
      <p className="pace-body max-w-[505px] text-pace-ink-2">
        Your answers were saved. They will be analyzed together with everyone else’s, and no one will see your individual
        responses.
      </p>
      <ul className="flex flex-wrap justify-center gap-2.5">
        <li className={`${chip} bg-pace-green-tint text-pace-green-deep`}>{summary.ratings} ratings</li>
        <li className={`${chip} bg-pace-purple-tint text-pace-purple`}>
          {summary.comments} {summary.comments === 1 ? "comment" : "comments"}
        </li>
        <li className={`${chip} bg-pace-sunken text-pace-ink-2`}>
          {summary.version === "student" ? "Student" : "Instructor"} version
        </li>
      </ul>
      <div className="flex flex-wrap justify-center gap-3">
        <Link
          href="/"
          className="pace-body rounded-2xl bg-pace-green px-6 py-3.5 font-semibold text-white shadow-[0_4px_0_0_var(--color-pace-green-deep)] transition-[transform,box-shadow] duration-100 active:translate-y-1 active:shadow-[0_0_0_0_var(--color-pace-green-deep)]"
        >
          Back to PACE
        </Link>
        <a
          href="https://github.com/fjdvm/fr-gaits"
          className="pace-body rounded-2xl border-[1.5px] border-pace-line bg-white px-6 py-3.5 font-semibold text-pace-ink shadow-[0_4px_0_0_#d9d5cc]"
        >
          Download the paper
        </a>
      </div>
    </div>
  );
}
