import { getIronSession, type IronSession } from "iron-session";
import { cookies } from "next/headers";
import type { AuthUser } from "@/types/Account";

const password = process.env.SESSION_PASSWORD;
if (!password || password.length < 32) {
  throw new Error("SESSION_PASSWORD must contain at least 32 characters.");
}

export const sessionOptions = {
  password,
  cookieName: "sat_session",
  ttl: 60 * 60 * 12, // matches the API token lifetime
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    sameSite: "lax" as const,
    path: "/",
  },
};

/** Sealed (encrypted) cookie: the bearer token never reaches client JavaScript. */
export interface SessionData {
  bearerToken?: string;
  user?: AuthUser;
}

export async function getSession(): Promise<IronSession<SessionData>> {
  return getIronSession<SessionData>(await cookies(), sessionOptions);
}
