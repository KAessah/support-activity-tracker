import type { Metadata } from "next";
import { connection } from "next/server";
import { ReportsContent } from "@/components/reports/ReportsContent";
import { getReportPageData, parseReportQuery } from "@/lib/api/reports";

export const metadata: Metadata = { title: "Reports" };

export default async function ReportsPage({ searchParams }: PageProps<"/reports">) {
  await connection();
  const query = parseReportQuery(await searchParams);
  const data = await getReportPageData(query);

  return <ReportsContent data={data} query={query} />;
}
