import { unsealData } from "iron-session";
import { NextResponse, type NextRequest } from "next/server";
import { canAccessPath, getLandingPath } from "@/lib/auth/access";
import { sessionOptions, type SessionData } from "@/lib/session";
import { APP_ROUTES } from "@/lib/utils/routes";

/**
 * Page gate. Reads the sealed session and checks the requested path against
 * the shared route policies. The API still authorizes every request itself.
 */
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sealed = request.cookies.get(sessionOptions.cookieName)?.value;
  const session = sealed
    ? await unsealData<SessionData>(sealed, { password: sessionOptions.password, ttl: sessionOptions.ttl }).catch(() => null)
    : null;
  const user = session?.bearerToken ? session.user : undefined;

  if (pathname === APP_ROUTES.LOGIN) {
    return user ? NextResponse.redirect(new URL(getLandingPath(user), request.url)) : NextResponse.next();
  }

  if (!user) {
    const response = NextResponse.redirect(new URL(APP_ROUTES.LOGIN, request.url));
    response.cookies.delete(sessionOptions.cookieName);
    return response;
  }

  if (pathname === APP_ROUTES.ROOT || !canAccessPath(user, pathname)) {
    return NextResponse.redirect(new URL(getLandingPath(user), request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/login", "/board/:path*", "/reports/:path*", "/activities/:path*", "/team/:path*", "/account/:path*"],
};
