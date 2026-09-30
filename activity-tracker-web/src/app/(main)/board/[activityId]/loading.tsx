import { PageSkeleton } from "@/components/reusables/PageSkeleton";

export default function ActivityLoading() {
  return <PageSkeleton label="Loading activity" metrics={["Updates", "Days done", "Days pending", "Days not updated"]} search={false} />;
}
