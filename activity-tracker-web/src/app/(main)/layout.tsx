import { connection } from "next/server";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import { getAuthenticatedUser } from "@/actions/auth";
import { AppShell } from "@/components/layout/AppShell";
import { AccessProvider } from "@/components/reusables/AccessGate";
import { APP_ROUTES } from "@/lib/utils/routes";

export default async function MainLayout({ children }: { children: ReactNode }) {
  await connection();
  const profile = await getAuthenticatedUser();

  if (!profile.ok) {
    redirect(APP_ROUTES.LOGOUT);
  }

  return (
    <AccessProvider user={profile.data.data}>
      <AppShell>{children}</AppShell>
    </AccessProvider>
  );
}
