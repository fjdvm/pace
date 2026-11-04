type WeekSectionProps = { label: string; children: React.ReactNode };

export function WeekSection({ label, children }: WeekSectionProps) {
  return (
    <section className="flex flex-col">
      <h2 className="border-b border-solid [border-bottom-color:var(--color-pace-green-deep)] pb-3 pl-1 pt-6 text-[22px] font-bold leading-tight tracking-[-0.22px] text-pace-green-deep">
        {label}
      </h2>
      {children}
    </section>
  );
}
