import { SparkBuddy } from "../../spark-buddy/spark-buddy";
import { BandShell } from "../bands/band-shell";
import { ImageCard } from "../bands/image-card";
import { AppPanel } from "../bands/app-panel";

function ChatLogCard() {
  return (
    <ImageCard className="bg-[#efeeeb]">
      <div className="absolute inset-0 font-lp-sans">
        <AppPanel className="left-[137px] top-[-21px] h-[300px]">
          <div className="flex w-full flex-col gap-[5px] rounded-xl bg-[#f6f6f4] p-3 font-lp-mono text-[11px] font-medium text-[#334155]">
            <p>if n &gt; 0:</p>
            <p className="whitespace-pre">{'    print("Positive")'}</p>
          </div>
        </AppPanel>
        <div className="absolute left-[299px] top-[199px] rounded-[14px] bg-white px-3.5 py-2.5 shadow-[0_2px_8px_rgba(0,0,0,0.08)]">
          <p className="w-[170px] text-[12.5px] font-medium leading-[18px] text-[#111]">Just give me the fixed code.</p>
        </div>
        <div className="absolute left-[149px] top-[261px] rounded-[14px] bg-[#e4f7ec] px-3.5 py-2.5">
          <p className="w-[190px] text-[12.5px] font-medium leading-[18px] text-[#111]">
            {"I can't write it for you, but let's find it: what should print when n is 0?"}
          </p>
        </div>
        <SparkBuddy gaze={{ x: 4, y: 0 }} className="absolute left-[34px] top-[236px] w-[108px]" />
      </div>
    </ImageCard>
  );
}

export function ChatLogBand() {
  return (
    <BandShell
      id="chat-log"
      tone="white"
      cardFirst
      title={["Read each student's", "conversation with Spark"]}
      body="The full chat log stays with each submission, so instructors can see what students asked and how Spark answered, and confirm that it gave hints instead of solutions."
      link="How Spark's limits work →"
      card={<ChatLogCard />}
    />
  );
}
