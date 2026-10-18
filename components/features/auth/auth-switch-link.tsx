import Link from "next/link";

type AuthSwitchLinkProps = {
  prompt: string;
  label: string;
  href: string;
};

export function AuthSwitchLink({ prompt, label, href }: AuthSwitchLinkProps) {
  return (
    <p className="flex gap-1.5 text-[15px] leading-[1.55] text-pace-ink-2">
      {prompt}
      <Link href={href} className="font-bold text-pace-ink hover:underline">
        {label}
      </Link>
    </p>
  );
}
