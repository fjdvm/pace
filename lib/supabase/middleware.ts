import { prisma } from "@/lib/prisma";
import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          response = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const url = new URL(request.url);
  const redirect = () => {
    const result = NextResponse.redirect(url);
    response.cookies.getAll().forEach((cookie) => result.cookies.set(cookie));
    return result;
  };
  const isProtectedRoute = url.pathname.startsWith("/dashboard");
  const isAuthRoute = url.pathname === "/login";

  if (!user) {
    if (isProtectedRoute) {
      url.pathname = "/login";
      return redirect();
    }
    return response;
  }

  if (!isProtectedRoute && !isAuthRoute) return response;

  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: { isAdmin: true },
  });
  if (!dbUser) {
    await supabase.auth.signOut();
    url.pathname = "/login";
    url.search = "?error=google_sign_in";
    return redirect();
  }
  const isAdminRoute = url.pathname === "/dashboard/admin" || url.pathname.startsWith("/dashboard/admin/");
  if (isAdminRoute) {
    if (dbUser.isAdmin) return response;
    url.pathname = "/dashboard";
    return redirect();
  }

  if (isAuthRoute || ["/dashboard/student", "/dashboard/instructor"].some((path) => url.pathname === path || url.pathname.startsWith(`${path}/`))) {
    url.pathname = "/dashboard";
    return redirect();
  }

  return response;
}
