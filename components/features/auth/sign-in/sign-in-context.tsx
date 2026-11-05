"use client";

import { createContext, useContext, useMemo, useState } from "react";
import { SignInDialog } from "./sign-in-dialog";

type SignInContextValue = { open: () => void };

const SignInContext = createContext<SignInContextValue | null>(null);

export function useSignIn() {
  const context = useContext(SignInContext);
  if (!context) throw new Error("useSignIn must be used within SignInProvider");
  return context;
}

export function SignInProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const value = useMemo(() => ({ open: () => setIsOpen(true) }), []);

  return (
    <SignInContext.Provider value={value}>
      {children}
      <SignInDialog open={isOpen} onOpenChange={setIsOpen} />
    </SignInContext.Provider>
  );
}
