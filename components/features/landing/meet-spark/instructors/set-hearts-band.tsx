import { BandShell } from "../bands/band-shell";
import { ImageCard } from "../bands/image-card";
import { AppPanel } from "../bands/app-panel";
import { cn } from "@/lib/utils";

const tiers = ["1 · Concept", "2 · Where to look", "3 · Approach", "4 · Step outline", "5 · Near-pseudocode"];

function SetHeartsCard() {
  return (
    <ImageCard className="bg-[#e4eef1]">
      <AppPanel className="left-[137px] top-[23px] font-lp-sans">
        <p className="whitespace-nowrap text-xl font-bold text-lp-red" aria-label="3 of 5 hearts">♥ ♥ ♥ ♡ ♡</p>
        <p className="whitespace-nowrap text-[11px] font-medium text-[#8a8a8a]">Next heart in 12:40</p>
        {tiers.map((tier, i) => (
          <div
            key={tier}
            className={cn(
              "w-full whitespace-nowrap rounded-[10px] px-2.5 py-[7px] text-[11.5px] font-semibold",
              i < 2 ? "bg-lp-violet-tint text-lp-violet" : "bg-[#f4f4f2] text-[#9a9a9a]",
            )}
          >
            {tier}
          </div>
        ))}
      </AppPanel>
    </ImageCard>
  );
}

export function SetHeartsBand() {
  return (
    <BandShell
      id="set-hearts"
      tone="canvas"
      title={["Set how much AI help", "students get"]}
      body="Choose the number of hearts and how long each one takes to refill. Hints become more specific only as students spend more hearts."
      link="Spark →"
      card={<SetHeartsCard />}
    />
  );
}
