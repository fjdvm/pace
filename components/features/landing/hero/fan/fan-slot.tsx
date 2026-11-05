import type { CSSProperties, ReactNode } from "react";

export function FanSlot({ index, children }: { index: number; children: ReactNode }) {
  const style = {
    "--i": index,
    animationDelay: `${index * 80}ms`,
  } as CSSProperties;
  return (
    <div
      style={style}
      data-fan-slot className="absolute animate-pace-fan-rise [transform-style:preserve-3d] [left:calc(130px+var(--i)*172px)] [top:calc(135px-var(--i)*14px)] max-sm:[left:calc(-151px+var(--i)*118px)] max-sm:[top:calc(85px-var(--i)*12px)]"
    >
      <div
        style={{ animationDuration: `${4.4 + (index % 4) * 0.7}s`, animationDelay: `${index * 0.4}s` }}
        className="animate-pace-fan-float [transform-style:preserve-3d]"
      >
        <div className="transition-transform duration-500 ease-out [transform-style:preserve-3d] [transform:rotateY(-22deg)_rotateX(6deg)] max-sm:[transform:rotateY(-14deg)_rotateX(6deg)] hover:[transform:rotateY(0deg)_rotateX(0deg)_scale(1.05)]">
          {children}
        </div>
      </div>
    </div>
  );
}
