import { PaceTag } from "@/components/features/student/shared/pace-tag";

const rules = [
  ["+10", "Each test case you pass"],
  ["+50", "Perfect score on an assignment"],
  ["+30", "Solved without using the tutor"],
  ["+15", "Solved using 1–2 hearts"],
  ["+20", "Keeping your weekly streak"],
];

export function XpGuideCard() {
  return (
    <section className="flex w-full shrink-0 flex-col gap-3 rounded-[20px] border-[1.5px] border-pace-line bg-white p-5 lg:w-80">
      <h2 className="text-base font-bold leading-snug tracking-[-0.005em] text-pace-ink">How XP works</h2>
      {rules.map(([amount, text]) => (
        <div key={amount} className="flex items-center gap-3">
          <PaceTag tone="amber">{amount}</PaceTag>
          <p className="flex-1 text-[13px] leading-normal text-pace-ink-2">{text}</p>
        </div>
      ))}
      <p className="text-[13px] font-semibold leading-normal text-pace-purple">
        Fewer hints earn more XP, so it pays to try first.
      </p>
    </section>
  );
}
