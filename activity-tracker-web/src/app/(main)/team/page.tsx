import type { Metadata } from "next";
import { connection } from "next/server";
import { redirect } from "next/navigation";
import { getAuthenticatedUser } from "@/actions/auth";
import { TeamContent } from "@/components/team/TeamContent";
import { parseListQuery } from "@/lib/api/activities";
import { getTeamPageData } from "@/lib/api/team";
import { APP_ROUTES } from "@/lib/utils/routes";

export const metadata: Metadata = { title: "Team" };

export default async function TeamPage({ searchParams }: PageProps<"/team">) {
  await connection();
  const profile = await getAuthenticatedUser();
  if (!profile.ok) redirect(APP_ROUTES.LOGOUT);

  const query = parseListQuery(await searchParams);
  const data = await getTeamPageData(query, profile.data.data);

  return <TeamContent {...data} query={query} />;
}
