export function LegalSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-3xl border-[1.5px] border-pace-line bg-white p-6 sm:p-8">
      <h2 className="pace-h4 mb-3">{title}</h2>
      <p className="pace-body text-pace-ink-2">{children}</p>
    </section>
  );
}
