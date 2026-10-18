type PartCardProps = {
  part: string;
  title: string;
  description?: string;
  children: React.ReactNode;
};

export function PartCard({ part, title, description, children }: PartCardProps) {
  return (
    <section className="flex flex-col gap-7 rounded-[20px] border-[1.5px] border-pace-line bg-white p-6 shadow-[0_3px_0_0_var(--color-pace-line)] sm:p-8">
      <header className="flex flex-col gap-1.5">
        <p className="pace-eyebrow text-pace-muted">{part}</p>
        <h2 className="pace-h3 text-pace-ink">{title}</h2>
        {description && <p className="pace-body text-pace-ink-2">{description}</p>}
      </header>
      {children}
    </section>
  );
}
