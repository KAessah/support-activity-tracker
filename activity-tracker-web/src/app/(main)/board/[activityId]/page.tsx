import type { Metadata } from "next";
import { connection } from "next/server";
import { ActivityDetailContent } from "@/components/board/ActivityDetailContent";
import { getActivityHistory, parseBoardDate } from "@/lib/api/board";

export const metadata: Metadata = { title: "Activity" };

export default async function ActivityDetailPage({ params, searchParams }: PageProps<"/board/[activityId]">) {
  await connection();
  const { activityId } = await params;
  const history = await getActivityHistory(activityId, parseBoardDate(await searchParams));

  return <ActivityDetailContent history={history} />;
}
