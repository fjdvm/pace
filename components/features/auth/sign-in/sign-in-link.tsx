"use client";

import Link from "next/link";
import { useSignIn } from "./sign-in-context";

type SignInLinkProps = Omit<React.ComponentProps<typeof Link>, "href" | "onClick">;

export function SignInLink(props: SignInLinkProps) {
  const { open } = useSignIn();

  return (
    <Link
      {...props}
      href="/login"
      onClick={(event) => {
        event.preventDefault();
        open();
      }}
    />
  );
}
