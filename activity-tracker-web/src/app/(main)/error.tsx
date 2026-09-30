"use client";

import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function MainError({ error, retry }: { error: Error & { digest?: string }; retry: () => void }) {
  return (
    <section className="mx-auto mt-10 max-w-md rounded-2xl bg-surface p-8 text-center">
      <span className="mx-auto grid size-12 place-items-center rounded-full bg-status-warning-bg text-status-warning-fg">
        <AlertTriangle className="size-5" />
      </span>
      <h1 className="mt-4 text-lg font-medium">This page couldn&apos;t be loaded</h1>
      <p className="mt-1 text-sm text-tertiary">
        The server may be unavailable. Please try again in a moment.
        {error.digest && <span className="mt-2 block text-[11px]">Reference: {error.digest}</span>}
      </p>
      <Button className="mt-6" onClick={() => retry()}>Try again</Button>
    </section>
  );
}
