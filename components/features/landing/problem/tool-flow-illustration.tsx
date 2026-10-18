"use client";

import { cn } from "@/lib/utils";
import { LandingIcon } from "../shared/landing-icon";
import { useCycle } from "../shared/use-cycle";
import { ToolTile } from "./tool-tile";

export function ToolFlowIllustration() {
  const { ref, step } = useCycle(6, 900);

  return (
    <div ref={ref} className="absolute inset-0">
      <ToolTile icon="icon-code" label="IDE" left={28} top={32} active delay="0s" />
      <ToolTile icon="icon-file" label="Docs" left={241} top={32} active={step >= 1} delay="0.4s" />
      <ToolTile icon="icon-file" label="PDF" left={28} top={104} active={step >= 2} delay="0.8s" />
      <ToolTile icon="icon-upload" label="LMS" left={244} top={104} active={step >= 3} delay="1.2s" />
      <Arrow name="problem-arrow-short" left={139.5} top={42} width={60} height={20} shown={step >= 1} />
      <Arrow name="problem-arrow-diagonal" left={70} top={66} width={209} height={40} shown={step >= 2} fromRight />
      <Arrow name="problem-arrow-short" left={143} top={114} width={60} height={20} shown={step >= 3} />
      <span
        className={cn(
          "pace-small absolute left-7 top-[164px] rounded-full bg-pace-night px-3 py-1.5 font-semibold text-pace-cream transition-transform duration-500",
          step >= 4 ? "scale-110" : "scale-100",
        )}
      >
        4 apps · 1 assignment
      </span>
    </div>
  );
}

type ArrowProps = {
  name: string;
  left: number;
  top: number;
  width: number;
  height: number;
  shown: boolean;
  fromRight?: boolean;
};

function Arrow({ name, left, top, width, height, shown, fromRight }: ArrowProps) {
  const hidden = fromRight ? "inset(0 0 0 100%)" : "inset(0 100% 0 0)";
  return (
    <div
      className="absolute transition-[clip-path] duration-700 ease-out"
      style={{ left, top, clipPath: shown ? "inset(0 0 0 0)" : hidden }}
    >
      <LandingIcon name={name} size={width} width={width} height={height} />
    </div>
  );
}
