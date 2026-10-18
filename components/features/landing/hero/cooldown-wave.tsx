const wavePath = "M2 20C30 20 30 140 58 140C86 140 88 60 100 52";

export function CooldownWave() {
  return (
    <div className="absolute left-[1218px] top-[224px] h-[170px] w-[140px]">
      <svg
        width="140"
        height="170"
        viewBox="0 0 140 170"
        fill="none"
        className="absolute inset-0 overflow-visible"
        aria-hidden
      >
        <path
          d={wavePath}
          stroke="#7491FF"
          strokeOpacity="0.45"
          strokeWidth="3"
          strokeLinecap="round"
        />
      </svg>
      <div
        className="absolute left-0 top-0 size-0 animate-pace-ride"
        style={{
          offsetPath: `path('${wavePath}')`,
          offsetRotate: "0deg",
          animationDuration: "5s",
        }}
      >
        <span className="absolute left-[-0.75px] top-[-52px] h-[170px] border-l-[1.5px] border-dashed border-[#7491FF]" />
        <span className="absolute left-[-13px] top-[-13px] size-[26px] rounded-full border-[3px] border-white bg-pace-blue shadow-[0_0_10px_2px_rgba(91,124,250,0.45)]" />
        <span className="absolute left-[-13px] top-[-13px] size-[26px] animate-pace-pulse-ring rounded-full border-2 border-pace-blue" />
      </div>
    </div>
  );
}
