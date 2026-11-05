import { FanCardShell } from "../fan-card-shell";

const options = [
  { label: "an int", correct: false },
  { label: "a str", correct: true },
  { label: "a float", correct: false },
];

export function QuizCard() {
  return (
    <FanCardShell prompt="Item 3 of 3: What does input() return?">
      {options.map(({ label, correct }) => (
        <div
          key={label}
          className={`w-full rounded-lg border px-2 py-[7px] font-lp-mono text-[8.5px] font-medium ${correct ? "border-lp-green bg-lp-green-tint text-lp-green-ink" : "border-lp-line bg-[#f4f4f2] text-lp-ink-2"}`}
        >
          {label}
        </div>
      ))}
    </FanCardShell>
  );
}
