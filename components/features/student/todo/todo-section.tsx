import { PaceTag } from "@/components/features/student/shared/pace-tag";

type TodoSectionProps = {
  title: string;
  count: number;
  tone: "red" | "neutral" | "green";
  children: React.ReactNode;
};

export function TodoSection({ title, count, tone, children }: TodoSectionProps) {
  if (count === 0) return null;
  return (
    <section className="flex w-full flex-col gap-2.5">
      <div className="flex items-center gap-2">
        <h2 className="text-base font-bold leading-snug tracking-[-0.005em] text-pace-ink">{title}</h2>
        <PaceTag tone={tone}>{count}</PaceTag>
      </div>
      {children}
    </section>
  );
}
