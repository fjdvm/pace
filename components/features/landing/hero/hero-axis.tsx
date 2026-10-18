const tickOffsets = Array.from({ length: 14 }, (_, i) => 120 + i * 62);

export function HeroAxis({ top }: { top: number }) {
  return (
    <div
      className="absolute left-[170px] h-3 w-[1100px]"
      style={{ top }}
      aria-hidden
    >
      <div
        className="absolute left-0 top-1.5 h-px w-full"
        style={{
          backgroundImage:
            "linear-gradient(90deg, rgba(217,214,204,0) 0%, rgb(217,214,204) 15%, rgb(217,214,204) 85%, rgba(217,214,204,0) 100%)",
        }}
      />
      {tickOffsets.map((left) => (
        <div
          key={left}
          className="absolute top-0.5 h-2 w-px bg-pace-line"
          style={{ left }}
        />
      ))}
    </div>
  );
}
