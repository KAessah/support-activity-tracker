import type { Metadata } from "next";
import { connection } from "next/server";
import { ActivitiesContent } from "@/components/activities/ActivitiesContent";
import { getActivitiesPageData, parseListQuery } from "@/lib/api/activities";

export const metadata: Metadata = { title: "Activities" };

export default async function ActivitiesPage({ searchParams }: PageProps<"/activities">) {
  await connection();
  const query = parseListQuery(await searchParams);
  const { activities, categories } = await getActivitiesPageData(query);

  return <ActivitiesContent activities={activities} categories={categories} query={query} />;
}
