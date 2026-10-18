type FormSectionProps = {
  step: number;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
};

export function FormSection({ step, title, subtitle, children }: FormSectionProps) {
  return (
    <section className="flex flex-col gap-5 rounded-[20px] border-[1.5px] border-pace-line bg-white p-6 shadow-[0_3px_0_0_var(--color-pace-line)]">
      <header className="flex items-center gap-3">
        <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-pace-ink text-xs font-bold text-white">
          {step}
        </span>
        <div className="flex flex-col">
          <h2 className="text-lg font-bold leading-tight text-pace-ink">{title}</h2>
          {subtitle && <p className="text-xs text-pace-ink-2">{subtitle}</p>}
        </div>
      </header>
      {children}
    </section>
  );
}
