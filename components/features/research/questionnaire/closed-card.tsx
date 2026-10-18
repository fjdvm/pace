import Link from "next/link";

export function ClosedCard() {
  return (
    <div className="mx-auto flex w-full max-w-[620px] flex-col items-center gap-5 rounded-[28px] border-[1.5px] border-pace-line bg-white px-8 py-14 text-center shadow-[0_4px_0_0_var(--color-pace-line)]">
      <h1 className="pace-h3 text-pace-ink">The questionnaire is closed</h1>
      <p className="pace-body max-w-[460px] text-pace-ink-2">
        We are no longer collecting responses. Thank you to everyone who took part in evaluating PACE.
      </p>
      <Link href="/" className="pace-body rounded-2xl bg-pace-ink px-6 py-3.5 font-semibold text-white shadow-[0_4px_0_0_black]">
        Back to PACE
      </Link>
    </div>
  );
}
