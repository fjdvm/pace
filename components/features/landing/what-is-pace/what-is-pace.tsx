import { AcronymCard } from "./acronym-card";
import { acronym } from "./acronym-data";

export function WhatIsPace() {
  return (
    <section className="bg-pace-canvas px-6 pb-20 pt-10 lg:pb-[120px]">
      <div className="mx-auto flex w-full max-w-[1200px] flex-col items-center gap-12">
        <p className="pace-eyebrow text-pace-green-deep">What is PACE</p>
        <p className="font-pace-display text-[clamp(26px,3.6vw,36px)] font-medium leading-[1.25] tracking-[-0.01em] text-pace-ink max-w-[920px] text-center">
          PACE is a research prototype. It puts a{" "}
          <span className="text-pace-purple">hint-only AI tutor</span> inside a
          browser code editor and uses{" "}
          <span className="text-pace-red">hearts</span> to limit how often
          students ask. We are studying whether students and instructors{" "}
          <span className="text-pace-green-deep">accept it</span>.
        </p>
        <div className="grid w-full gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {acronym.map((item) => (
            <AcronymCard key={item.letter} {...item} />
          ))}
        </div>
      </div>
    </section>
  );
}
