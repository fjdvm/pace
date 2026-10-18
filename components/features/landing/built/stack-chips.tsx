const stack = ["Next.js", "React", "Monaco editor", "Supabase", "Prisma", "Judge0", "Vercel AI SDK"];

export function StackChips() {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="pace-body font-medium text-pace-ink-2">Built with</span>
      {stack.map((item) => (
        <span
          key={item}
          className="pace-small rounded-full bg-white px-3 py-1.5 font-semibold text-pace-ink"
        >
          {item}
        </span>
      ))}
    </div>
  );
}
