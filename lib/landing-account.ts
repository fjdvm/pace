import { createClient } from "@/lib/supabase/server";

export type LandingAccount = { href: string; label: string } | null;

export async function getLandingAccount(): Promise<LandingAccount> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  return { href: "/dashboard", label: "Go back" };
}
