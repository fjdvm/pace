function Stat({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col">
      <span className="text-[22px] font-bold leading-tight tracking-[-0.22px] text-pace-ink md:text-[32px] md:leading-[1.15] md:tracking-[-0.48px]">
        {value}
      </span>
      <span className="text-[13px] leading-normal text-pace-muted">{label}</span>
    </div>
  );
}

export function WorkStats({ turnedIn, assigned }: { turnedIn: number; assigned: number }) {
  return (
    <div className="flex gap-8 md:gap-10 md:py-2">
      <Stat value={turnedIn} label="Turned in" />
      <Stat value={assigned} label="Assigned" />
    </div>
  );
}
