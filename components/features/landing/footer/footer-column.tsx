import Link from "next/link";
import { SignInLink } from "@/components/features/auth/sign-in/sign-in-link";
import { LandingIcon } from "../shared/landing-icon";

export type FooterLink = {
  label: string;
  href: string;
  download?: boolean;
  signIn?: boolean;
};

type FooterColumnProps = {
  title: string;
  links: FooterLink[];
};

const linkClass =
  "pace-body flex items-center gap-2 whitespace-nowrap font-medium text-pace-ink transition-colors hover:text-pace-green-deep";

export function FooterColumn({ title, links }: FooterColumnProps) {
  return (
    <div className="flex flex-col gap-3">
      <p className="pace-eyebrow text-pace-muted">{title}</p>
      {links.map((link) => {
        const Component = link.signIn ? SignInLink : Link;
        return (
          <Component
            key={link.label}
            href={link.href}
            className={linkClass}
          >
            {link.label}
            {link.download && <LandingIcon name="icon-download" size={15} />}
          </Component>
        );
      })}
    </div>
  );
}
