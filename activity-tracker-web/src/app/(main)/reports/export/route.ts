import { NextResponse, type NextRequest } from "next/server";
import { API_BASE_URL, authHeader } from "@/lib/api/apiHandler";
import { APP_ROUTES, API_ROUTES } from "@/lib/utils/routes";

/** Streams the CSV export from the API, authenticated with the session token. */
export async function GET(request: NextRequest) {
  const headers = await authHeader();
  if (!headers.Authorization) {
    return NextResponse.redirect(new URL(APP_ROUTES.LOGIN, request.url));
  }

  const upstream = await fetch(`${API_BASE_URL}${API_ROUTES.REPORTS.EXPORT}${request.nextUrl.search}`, {
    headers: { ...headers, Accept: "text/csv" },
    cache: "no-store",
  });

  if (!upstream.ok || !upstream.body) {
    return NextResponse.json({ success: false, message: "Export failed." }, { status: upstream.status });
  }

  return new Response(upstream.body, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": upstream.headers.get("content-disposition") ?? 'attachment; filename="activity-report.csv"',
    },
  });
}
