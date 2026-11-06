import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type BandShellProps = {
  id: string;
  title: [string, string];
  body: string;
  link: string;
  card?: ReactNode;
  cardFirst?: boolean;
  tone: "canvas" | "white";
};

export function BandShell({ id, title, body, link, card, cardFirst, tone }: BandShellProps) {
  return (
    <section
      data-band={id}
      className={cn(
        "flex w-full flex-col items-center gap-7 px-5 py-14 xl:flex-row xl:justify-center xl:gap-28 xl:px-[165px] xl:py-[100px]",
        tone === "canvas" ? "bg-lp-canvas" : "bg-white",
      )}
    >
      <div className="flex w-full max-w-[350px] flex-col gap-6 xl:order-1 xl:w-[440px] xl:max-w-none">
        <h3 className="font-lp-sans text-2xl font-normal leading-[30px] tracking-[-0.24px] text-[#111] xl:text-[32px] xl:leading-10 xl:tracking-[-0.32px]">
          {title[0]} <br className="hidden xl:block" />
          {title[1]}
        </h3>
        <p className="font-lp-sans text-base leading-[25px] text-[#5f5f5f]">{body}</p>
        <p className="font-lp-sans text-base font-medium text-lp-teal">{link}</p>
      </div>
      {card && (
        <div className={cn("order-first", cardFirst ? "xl:order-0" : "xl:order-2")}>
          {card}
        </div>
      )}
    </section>
  );
}
