import { BandShell } from "./band-shell";
import { ImageCard } from "./image-card";
import { AppPanel } from "./app-panel";

const code = ["a = int(input())", "b = int(input())", "print(a + b)"];

function SeparateToolsCard() {
  return (
    <ImageCard className="bg-[#f1ebe2]">
      <AppPanel className="left-[137px] top-[59px] font-lp-sans">
        <p className="text-[13px] font-semibold text-[#111]">Lab 2 · Sum of Two Numbers</p>
        <div className="flex w-full flex-col gap-[5px] rounded-xl bg-[#1f2430] p-3 font-lp-mono text-[11px] font-medium text-[#e2e8f0]">
          {code.map((line) => (
            <p key={line}>{line}</p>
          ))}
        </div>
        <div className="flex w-full gap-1.5">
          {[1, 2, 3].map((n) => (
            <span key={n} className="rounded-full bg-lp-green-tint px-2 py-[5px] text-[10.5px] font-semibold text-[#15803d]">
              ✓ Test {n}
            </span>
          ))}
        </div>
        <div className="flex w-full items-center justify-center rounded-xl bg-[#2bc84e] py-[11px] text-[13px] font-semibold text-white">
          Turn in
        </div>
      </AppPanel>
    </ImageCard>
  );
}

export function SeparateToolsBand() {
  return (
    <BandShell
      id="separate-tools"
      tone="canvas"
      title={["One window for the", "whole assignment"]}
      body="In the current workflow, students write code in an IDE, paste it into a document, convert it to PDF, and upload it to the LMS. In PACE, they write, run, test, and turn in code in the same place."
      link="Problem 1 in the study →"
      card={<SeparateToolsCard />}
    />
  );
}
