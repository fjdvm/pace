import { cn } from "@/lib/utils";

type SectionShellProps = {
  id?: string;
  className?: string;
  innerClassName?: string;
  children: React.ReactNode;
};

export function SectionShell({
  id,
  className,
  innerClassName,
  children,
}: SectionShellProps) {
  return (
    <section id={id} className={cn("scroll-mt-24 px-6 py-20 lg:py-[120px]", className)}>
      <div className={cn("mx-auto flex w-full max-w-[1200px] flex-col gap-14", innerClassName)}>
        {children}
      </div>
    </section>
  );
}
