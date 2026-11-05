"use client";
import { createContext, useContext } from "react";
import type { ComponentProps, ReactNode } from "react";
import { TopBar } from "./top-bar/top-bar";

type Session = ComponentProps<typeof TopBar>;
const DashboardSession = createContext<Session | null>(null);
export function DashboardSessionProvider({
  children,
  value,
}: {
  children: ReactNode;
  value: Session;
}) {
  return (
    <DashboardSession.Provider value={value}>
      {children}
    </DashboardSession.Provider>
  );
}
export function useDashboardSession() {
  return useContext(DashboardSession);
}
