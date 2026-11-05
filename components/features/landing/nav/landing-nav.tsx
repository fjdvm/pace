import { getLandingAccount } from "@/lib/landing-account";
import { LandingNavBar } from "./landing-nav-bar";

export async function LandingNav() {
  const account = await getLandingAccount();
  return <LandingNavBar account={account} />;
}
