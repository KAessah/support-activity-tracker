import { PageSkeleton } from "@/components/reusables/PageSkeleton";

export default function ReportsLoading() {
  return <PageSkeleton label="Loading reports" metrics={["Total Updates", "Marked Done", "Marked Pending", "Personnel Involved", "Days Covered"]} />;
}
