import { FanCardShell } from "../fan-card-shell";

const bubble = "w-full rounded-[10px] px-2 py-[6px] font-lp-sans text-[9px] font-medium leading-3 text-lp-ink";

export function SparkCard() {
  return (
    <FanCardShell prompt="Ask Spark why test 3 fails.">
      <p className={`${bubble} bg-lp-line-soft`}>Why does test 3 print nothing?</p>
      <p className={`${bubble} bg-[#e3f7ec]`}>
        What does your program do when both inputs are 0? Look at line 5.
      </p>
    </FanCardShell>
  );
}
