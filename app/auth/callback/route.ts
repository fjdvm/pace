import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const failure = new URL("/login?error=google_sign_in", url.origin);
  const code = url.searchParams.get("code");
  if (!code || url.searchParams.has("error")) return NextResponse.redirect(failure);

  const supabase = await createClient();
  try {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (error) return NextResponse.redirect(failure);

    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user?.email || !user.email_confirmed_at ||
        !user.identities?.some((identity) => identity.provider === "google")) {
      await supabase.auth.signOut();
      return NextResponse.redirect(failure);
    }

    const profileName = user.user_metadata?.full_name ?? user.user_metadata?.name;
    const name = typeof profileName === "string" ? profileName : undefined;
    await prisma.user.upsert({
      where: { id: user.id },
      create: { id: user.id, email: user.email, name, role: "student" },
      update: { email: user.email, name },
    });
    return NextResponse.redirect(new URL("/dashboard", url.origin));
  } catch {
    await supabase.auth.signOut();
    return NextResponse.redirect(failure);
  }
}
