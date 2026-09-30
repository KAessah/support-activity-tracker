import Link from "next/link";
import { APP_ROUTES } from "@/lib/utils/routes";

export default function NotFound() {
  return (
    <main className="grid min-h-screen place-items-center p-6">
      <div className="max-w-sm rounded-2xl bg-surface p-8 text-center">
        <p className="text-5xl font-medium tracking-tight text-brand-600">404</p>
        <h1 className="mt-3 text-lg font-medium">Page not found</h1>
        <p className="mt-1 text-sm text-tertiary">The page you&apos;re looking for doesn&apos;t exist or has moved.</p>
        <Link href={APP_ROUTES.ROOT} className="mt-6 inline-flex h-10 items-center rounded-full bg-brand-600 px-5 text-sm text-white hover:bg-brand-700">
          Go to dashboard
        </Link>
      </div>
    </main>
  );
}
