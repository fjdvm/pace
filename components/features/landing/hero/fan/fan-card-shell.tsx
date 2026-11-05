import type { ReactNode } from "react";

export function FanCardShell({ prompt, children }: { prompt: string; children: ReactNode }) {
  return (
    <div className="flex h-[236px] w-[176px] flex-col gap-3 overflow-hidden rounded-[22px] bg-white p-4 shadow-[0_8px_24px_0_rgba(0,0,0,0.05)]">
      <p className="w-full font-lp-sans text-[9.5px] font-medium leading-[13px] text-lp-faint">
        {prompt}
      </p>
      {children}
    </div>
  );
}
