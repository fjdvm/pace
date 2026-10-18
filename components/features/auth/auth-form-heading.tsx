type AuthFormHeadingProps = {
  title: string;
  subtitle: string;
};

export function AuthFormHeading({ title, subtitle }: AuthFormHeadingProps) {
  return (
    <div className="flex flex-col gap-2">
      <h2 className="text-[32px] font-bold leading-[1.15] tracking-[-0.48px] text-pace-ink">{title}</h2>
      <p className="text-[15px] leading-[1.55] text-pace-ink-2">{subtitle}</p>
    </div>
  );
}
