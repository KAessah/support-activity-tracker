import type { Metadata } from "next";
import { AccountContent } from "@/components/account/AccountContent";

export const metadata: Metadata = { title: "My Account" };

export default function AccountPage() {
  // The profile is already loaded by the (main) layout and shared via AccessProvider.
  return <AccountContent />;
}
