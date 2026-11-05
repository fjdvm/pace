import { LandingView } from "@/components/features/landing/landing-view";
import { OpenSignInOnMount } from "./sign-in/open-sign-in-on-mount";

export function LoginPage() {
  return (
    <>
      <LandingView />
      <OpenSignInOnMount />
    </>
  );
}
