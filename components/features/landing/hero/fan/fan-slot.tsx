import type { CSSProperties, ReactNode } from "react";

export function FanSlot({
  index,
  fade,
  children,
}: {
  index: number;
  fade: boolean;
  children: ReactNode;
}) {
  const style = {
    "--i": index,
    animationDelay: `${index * 80}ms`,
  } as CSSProperties;
  return (
    <div
      style={style}
      data-fan-slot
      className="absolute animate-pace-fan-rise [transform-style:preserve-3d] [left:calc(230px+var(--i)*138px)] [top:calc(170px-var(--i)*22px)] max-sm:[left:calc(-24px+var(--i)*120px)] max-sm:[top:calc(64px-var(--i)*16px)]"
    >
      <div
        style={{ animationDuration: `${4.4 + (index % 4) * 0.7}s`, animationDelay: `${index * 0.4}s` }}
        className="group animate-pace-fan-float [transform-style:preserve-3d]"
      >
        <div className="relative origin-top-left transition-transform duration-500 ease-out [transform-style:preserve-3d] [transform:rotateX(8deg)_rotateY(28deg)_rotateZ(-4deg)] max-sm:scale-[0.9] max-sm:[transform:scale(0.9)_rotateX(8deg)_rotateY(26deg)_rotateZ(-4deg)] group-hover:[transform:rotateY(0deg)_scale(1.05)] max-sm:group-hover:[transform:scale(0.945)_rotateY(0deg)]">
          {children}
          {fade && (
            <div
              aria-hidden
              className="pointer-events-none absolute right-0 top-0 h-full w-[45%] rounded-r-[22px] bg-[linear-gradient(to_right,rgba(244,243,241,0),rgba(244,243,241,0.7)_60%,#f4f3f1)]"
            />
          )}
        </div>
      </div>
    </div>
  );
}
