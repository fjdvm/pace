import { Wordmark } from "../shared/wordmark";
import { FooterColumn } from "./footer-column";
import { footerColumns } from "./footer-links";

export function LandingFooter({ homeHref = "" }: { homeHref?: string }) {
  return (
    <footer className="bg-black px-6 pb-24 pt-14 font-lp-sans sm:px-[150px] sm:pt-[88px]">
      <div className="mx-auto flex w-full max-w-[1140px] flex-col gap-8 sm:flex-row sm:justify-between">
        <Wordmark className="text-white" />
        <div className="flex flex-col gap-7 sm:flex-row sm:gap-14">
          {footerColumns.map((column) => (
            <FooterColumn key={column.title} {...column} homeHref={homeHref} />
          ))}
        </div>
      </div>
    </footer>
  );
}
