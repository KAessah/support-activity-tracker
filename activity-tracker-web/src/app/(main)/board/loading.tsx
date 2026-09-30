import { PageSkeleton } from "@/components/reusables/PageSkeleton";

export default function BoardLoading() {
  return <PageSkeleton label="Loading daily board" metrics={["Total Activities", "Done", "Pending", "Not Updated", "Completion"]} />;
}
