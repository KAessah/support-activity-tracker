import { NextResponse, type NextRequest } from "next/server";
import { API_BASE_URL } from "@/lib/api/apiHandler";
import { getSession } from "@/lib/session";
import { APP_ROUTES, API_ROUTES } from "@/lib/utils/routes";

/** Single exit point: revokes the API token (best effort) and destroys the session. */
async function logout(request: NextRequest) {
  const session = await getSession();

  if (session.bearerToken) {
    await fetch(`${API_BASE_URL}${API_ROUTES.AUTH.LOGOUT}`, {
      method: "POST",
      headers: { Accept: "application/json", Authorization: `Bearer ${session.bearerToken}` },
      cache: "no-store",
    }).catch(() => null);
  }

  session.destroy();

  return NextResponse.redirect(new URL(APP_ROUTES.LOGIN, request.url), { status: 303 });
}

export { logout as GET, logout as POST };
