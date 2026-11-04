"use client";

import { createContext, useContext, useEffect, useState } from "react";
import type { NamedClass } from "./use-active-class";

type ClassTitleState = { current: NamedClass | null; setCurrent: (value: NamedClass | null) => void };

const ClassTitleContext = createContext<ClassTitleState>({ current: null, setCurrent: () => {} });

export function ClassTitleProvider({ children }: { children: React.ReactNode }) {
  const [current, setCurrent] = useState<NamedClass | null>(null);
  return <ClassTitleContext.Provider value={{ current, setCurrent }}>{children}</ClassTitleContext.Provider>;
}

export function useClassTitleOverride() {
  return useContext(ClassTitleContext).current;
}

export function SetClassTitle({ id, name }: NamedClass) {
  const { setCurrent } = useContext(ClassTitleContext);
  useEffect(() => {
    setCurrent({ id, name });
    return () => setCurrent(null);
  }, [id, name, setCurrent]);
  return null;
}
