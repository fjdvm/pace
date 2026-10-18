import Link from "next/link";

export function SignupLegalNotice({ action }: { action: string }) {
  const linkClass = "underline-offset-2 hover:underline";
  return (
    <p className="text-[13px] leading-normal text-pace-muted">
      By {action}, you agree to the{" "}
      <Link href="/terms" className={linkClass}>
        Terms
      </Link>{" "}
      and{" "}
      <Link href="/privacy" className={linkClass}>
        Privacy Policy
      </Link>
      .
    </p>
  );
}
