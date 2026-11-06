import { BandShell } from "../bands/band-shell";
import { ImageCard } from "../bands/image-card";
import { AppPanel } from "../bands/app-panel";

const code = ["a = int(input())", "b = int(input())", "print(a + b)"];

function CreateClassCard() {
  return (
    <ImageCard className="bg-[#f1ebe2]">
      <AppPanel className="left-[137px] top-[59px] font-lp-sans">
        <p className="text-[13px] font-semibold text-[#111]">New activity · Lab 2 · 3 items</p>
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
          Post to class
        </div>
      </AppPanel>
    </ImageCard>
  );
}

export function CreateClassBand() {
  return (
    <BandShell
      id="create-class"
      tone="canvas"
      title={["Create a class and", "post activities"]}
      body="Create a class, share the join code, and post activities with one or more items: coding problems with visible and hidden test cases, or multiple-choice questions."
      link="For instructors →"
      card={<CreateClassCard />}
    />
  );
}
