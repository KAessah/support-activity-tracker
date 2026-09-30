import { PageSkeleton } from "@/components/reusables/PageSkeleton";

export default function TeamLoading() {
  return <PageSkeleton label="Loading team" metrics={["Team Members", "Active Accounts", "Deactivated Accounts"]} />;
}
