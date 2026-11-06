export function TypingDots() {
  return (
    <span aria-hidden className="flex items-center gap-1 py-1">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="size-1.5 animate-pulse rounded-full bg-[#7aa68b]"
          style={{ animationDelay: `${i * 150}ms` }}
        />
      ))}
    </span>
  );
}
