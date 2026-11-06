import { StudyNav } from "./study-nav";

type PageHeaderProps = { eyebrow: string; title: string; intro: string };

export function PageHeader({ eyebrow, title, intro }: PageHeaderProps) {
  return (
    <header className="flex flex-col items-center gap-5 bg-lp-canvas px-4 pb-10 pt-4 sm:px-6 sm:pb-[72px] sm:pt-8">
      <StudyNav />
      <div className="flex w-full max-w-[1110px] flex-col gap-[18px] px-1 pt-8 sm:px-0 sm:pt-14">
        <p className="text-[15px] font-medium text-lp-teal">{eyebrow}</p>
        <h1 className="font-lp-serif text-[38px] font-medium leading-[42px] tracking-[-0.57px] text-lp-ink sm:text-[56px] sm:leading-[62px] sm:tracking-[-0.84px]">
          {title}
        </h1>
        <p className="max-w-[760px] text-[17px] leading-[26px] text-lp-muted sm:text-[19px] sm:leading-[29px]">{intro}</p>
      </div>
    </header>
  );
}
