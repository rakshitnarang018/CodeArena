import { NextRequest, NextResponse } from "next/server";
import { roleProtectedRoutes, RoleType } from "./lib/roles";

/**
 * Middleware function to handle route protection based on user roles
 * @param req NextRequest object
 * @returns NextResponse
 */
export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Get user role from cookie
  const userRole = req.cookies.get("userRole")?.value as RoleType;
  const authToken = req.cookies.get("authToken")?.value;

  // Public routes that don't require authentication
  const publicRoutes = ['/auth/login', '/auth/signup', '/'];
  if (publicRoutes.includes(pathname)) {
    // If authenticated user tries to access login/signup, redirect to dashboard
    if (authToken && (pathname === '/auth/login' || pathname === '/auth/signup')) {
      const url = req.nextUrl.clone();
      url.pathname = "/dashboard";
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  // Check if accessing dashboard routes
  if (pathname.startsWith("/dashboard")) {
    // Redirect to login if not authenticated
    if (!authToken) {
      const url = req.nextUrl.clone();
      url.pathname = "/auth/login";
      return NextResponse.redirect(url);
    }

    // Allow access to /dashboard root path even if userRole is missing
    if (!userRole && pathname === "/dashboard") {
      return NextResponse.next();
    }

    // If no user role but trying to access protected routes, redirect to login
    if (!userRole) {
      const url = req.nextUrl.clone();
      url.pathname = "/auth/login";
      return NextResponse.redirect(url);
    }

    // Sort routes by length (longest first) to match most specific routes first
    const sortedRoutes = Object.keys(roleProtectedRoutes).sort((a, b) => b.length - a.length);

    for (const route of sortedRoutes) {
      if (pathname.startsWith(route)) {
        const allowedRoles = roleProtectedRoutes[route];

        // If user doesn't have permission for this route
        if (!allowedRoles.includes(userRole)) {
          // Redirect to unauthorized page with role and route info
          const url = req.nextUrl.clone();
          url.pathname = "/unauthorized";
          url.searchParams.set("role", userRole);
          url.searchParams.set("route", pathname);
          return NextResponse.redirect(url);
        }

        break;
      }
    }
  }

  // Allow the request to proceed
  return NextResponse.next();
}

// Configure which paths should be checked by the middleware
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
