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

  const url = request.nextUrl.clone();
  const redirect = () => {
    const result = NextResponse.redirect(url);
    response.cookies.getAll().forEach((cookie) => result.cookies.set(cookie));
    return result;
  };
  const isProtectedRoute = url.pathname.startsWith("/dashboard") || url.pathname === "/pending-approval";
  const isAuthRoute = url.pathname === "/login" || url.pathname === "/signup" || url.pathname === "/forgot-password";
  const isResetPasswordRoute = url.pathname === "/reset-password";

  if (!user) {
    if (isProtectedRoute) {
      url.pathname = "/login";
      return redirect();
    }
    return response;
  }

  if (isResetPasswordRoute) {
    return response;
  }

  if (!user.email_confirmed_at && isProtectedRoute) {
    await supabase.auth.signOut();
    url.pathname = "/login";
    const redirectResponse = NextResponse.redirect(url);
    response.cookies.getAll().forEach((cookie) => redirectResponse.cookies.set(cookie));
    return redirectResponse;
  }

  if (!isProtectedRoute && !isAuthRoute) return response;

  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: { role: true, approvalStatus: true },
  });
  if (!dbUser) {
    await supabase.auth.signOut();
    url.pathname = "/login";
    url.search = "?error=google_sign_in";
    return redirect();
  }
  const { role, approvalStatus } = dbUser;

  if (role === "instructor" && approvalStatus !== "approved") {
    if (url.pathname !== "/pending-approval") {
      url.pathname = "/pending-approval";
      return redirect();
    }
  } else {
    if (url.pathname === "/pending-approval") {
      url.pathname = `/dashboard/${role}`;
      return redirect();
    }

    if (url.pathname === "/dashboard" || url.pathname.startsWith("/dashboard/")) {
      const expectedPrefix = `/dashboard/${role}`;
      if (url.pathname !== expectedPrefix && !url.pathname.startsWith(`${expectedPrefix}/`)) {
        url.pathname = expectedPrefix;
        return redirect();
      }
    }
  }

  if (isAuthRoute) {
    if (role === "instructor" && approvalStatus !== "approved") {
      url.pathname = "/pending-approval";
    } else {
      url.pathname = `/dashboard/${role}`;
    }
    return redirect();
  }

  return response;
}
