import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

// Public pages accessible to everyone
const publicPages = ["/", "/privacy", "/terms", "/faq", "/cookies", "/refund"];

// Auth pages (login, register, forgot-password) - redirect to dashboard if already authenticated
const authPages = ["/login", "/register", "/forgot-password"];

// Admin/Manager-only pages
const adminPages = ["/admin"];

// Protected pages requiring authentication (any role)
const protectedPages = ["/dashboard"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow API routes, static files, and NextAuth internals
  if (
    pathname.startsWith("/api/") ||
    pathname.startsWith("/_next/") ||
    pathname.startsWith("/favicon") ||
    pathname.includes(".") // static files
  ) {
    return NextResponse.next();
  }

  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const isAuthenticated = !!token;
  const userRole = token?.role as string | undefined;

  // Check if current path is a public page
  const isPublicPage = publicPages.some(
    (page) => pathname === page || pathname === "/"
  );

  // Check if current path is an auth page
  const isAuthPage = authPages.some((page) => pathname.startsWith(page));

  // Check if current path is an admin page
  const isAdminPage = adminPages.some((page) => pathname.startsWith(page));

  // Check if current path is a protected page
  const isProtectedPage = protectedPages.some((page) =>
    pathname.startsWith(page)
  );

  // Redirect authenticated users away from auth pages
  if (isAuthPage && isAuthenticated) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Redirect unauthenticated users trying to access protected pages
  if ((isProtectedPage || isAdminPage) && !isAuthenticated) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Check admin/manager access
  if (isAdminPage && isAuthenticated) {
    if (userRole !== "ADMIN" && userRole !== "MANAGER") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, etc.)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\..*$).*)",
  ],
};
