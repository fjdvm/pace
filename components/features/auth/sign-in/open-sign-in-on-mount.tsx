"use client";

import { useEffect } from "react";
import { useSignIn } from "./sign-in-context";

export function OpenSignInOnMount() {
  const { open } = useSignIn();

  useEffect(() => {
    open();
  }, [open]);

  return null;
}
