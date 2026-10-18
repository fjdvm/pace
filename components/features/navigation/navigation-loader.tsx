"use client";

import { Suspense } from "react";
import { LoadingOverlay } from "./loading-overlay";
import { useNavigationLoading } from "./use-navigation-loading";

function Loader() {
  return useNavigationLoading() ? <LoadingOverlay /> : null;
}

export function NavigationLoader() {
  return (
    <Suspense fallback={null}>
      <Loader />
    </Suspense>
  );
}
