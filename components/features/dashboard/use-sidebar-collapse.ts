"use client";

import { createContext, useCallback, useContext, useState, useSyncExternalStore } from "react";

const STORAGE_KEY = "app_sidebar_collapsed";
const listeners = new Set<() => void>();

function subscribe(listener: () => void) {
  listeners.add(listener);
  window.addEventListener("storage", listener);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", listener);
  };
}

function getSnapshot() {
  return window.localStorage.getItem(STORAGE_KEY) === "true";
}

function getServerSnapshot() {
  return false;
}

interface SidebarCollapseContextValue {
  collapsed: boolean;
  toggleCollapsed: () => void;
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
  toggleMobileOpen: () => void;
}

export const SidebarCollapseContext = createContext<SidebarCollapseContextValue | null>(null);

export function useSidebarCollapseState(): SidebarCollapseContextValue {
  const collapsed = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const [mobileOpen, setMobileOpen] = useState(false);

  const toggleCollapsed = useCallback(() => {
    window.localStorage.setItem(STORAGE_KEY, String(!getSnapshot()));
    listeners.forEach((listener) => listener());
  }, []);

  const toggleMobileOpen = useCallback(() => {
    setMobileOpen((prev) => !prev);
  }, []);

  return { collapsed, toggleCollapsed, mobileOpen, setMobileOpen, toggleMobileOpen };
}

export function useSidebarCollapse(): SidebarCollapseContextValue {
  const context = useContext(SidebarCollapseContext);
  if (!context) {
    throw new Error("useSidebarCollapse must be used within a SidebarCollapseProvider");
  }
  return context;
}
