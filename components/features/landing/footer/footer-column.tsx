import Link from "next/link";
import type { FooterColumnData } from "./footer-links";

const linkClass = "text-base leading-6 text-white transition-opacity hover:opacity-70";

export function FooterColumn({ title, links }: FooterColumnData) {
  return (
    <div className="flex w-[170px] flex-col gap-4">
      <p className="text-[15px] leading-normal text-lp-faint">{title}</p>
      {links.map((link) =>
        link.external ? (
          <a key={link.label} href={link.href} target="_blank" rel="noopener noreferrer" className={linkClass}>
            {link.label}
          </a>
        ) : (
          <Link key={link.label} href={link.href} className={linkClass}>
            {link.label}
          </Link>
        ),
      )}
    </div>
  );
}
