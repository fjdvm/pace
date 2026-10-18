import Link from "next/link";
import { LandingIcon } from "../shared/landing-icon";

export type FooterLink = {
  label: string;
  href: string;
  download?: boolean;
};

type FooterColumnProps = {
  title: string;
  links: FooterLink[];
};

export function FooterColumn({ title, links }: FooterColumnProps) {
  return (
    <div className="flex flex-col gap-3">
      <p className="pace-eyebrow text-pace-muted">{title}</p>
      {links.map((link) => (
        <Link
          key={link.label}
          href={link.href}
          className="pace-body flex items-center gap-2 whitespace-nowrap font-medium text-pace-ink transition-colors hover:text-pace-green-deep"
        >
          {link.label}
          {link.download && <LandingIcon name="icon-download" size={15} />}
        </Link>
      ))}
    </div>
  );
}
