"use client";

import { CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition, type FormEvent } from "react";
import { login } from "@/actions/auth";
import { Logo } from "@/components/layout/Logo";
import { Button } from "@/components/ui/Button";
import { Field, Input } from "@/components/ui/Form";

const POINTS = [
  "Mark each activity done or pending, with a remark",
  "Every update stamped with who made it and when",
  "Reports across any date range, exportable to CSV",
];

export function LoginContent() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function submit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      const res = await login({ email, password });
      if (res.ok) {
        router.replace(res.data);
      } else {
        setError(res.fieldErrors?.email ?? res.message);
      }
    });
  }

  return (
    <div className="grid min-h-screen lg:grid-cols-[1fr_1.1fr]">
      <section className="flex flex-col p-6 sm:p-10">
        <Logo />

        <div className="mx-auto my-auto w-full max-w-sm py-12">
          <h1 className="text-[28px] font-medium tracking-tight">Welcome back</h1>
          <p className="mt-1 text-sm text-tertiary">Sign in with your team account to continue.</p>

          <form onSubmit={submit} className="mt-8 space-y-4 rounded-2xl bg-surface p-6">
            <Field label="Email address">
              <Input type="email" autoComplete="email" required autoFocus value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@npontu.com" />
            </Field>
            <Field label="Password">
              <Input type="password" autoComplete="current-password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
            </Field>

            {error && <p role="alert" className="rounded-xl bg-red-50 px-4 py-2.5 text-[13px] text-red-700">{error}</p>}

            <Button type="submit" loading={isPending} className="w-full">Sign in</Button>
          </form>

          <p className="mt-6 text-center text-xs text-tertiary">Accounts are created by your team lead. Contact them if you can&apos;t sign in.</p>
        </div>
      </section>

      <section className="relative m-3 hidden overflow-hidden rounded-[28px] bg-brand-900 p-12 text-white lg:flex lg:flex-col lg:justify-end">
        <div className="absolute -top-24 -right-24 size-[28rem] rounded-full bg-brand-500/25 blur-3xl" />
        <div className="absolute -bottom-40 -left-20 size-[26rem] rounded-full bg-yellow-300/10 blur-3xl" />

        <div className="relative max-w-md">
          <h2 className="text-4xl leading-tight font-medium tracking-tight">
            Every check, every shift, <span className="text-brand-200">handed over cleanly.</span>
          </h2>
          <ul className="mt-8 space-y-3 text-sm text-white/80">
            {POINTS.map((p) => (
              <li key={p} className="flex items-center gap-3"><CheckCircle2 className="size-4 text-brand-200" /> {p}</li>
            ))}
          </ul>
          <p className="mt-12 text-xs text-white/50">Npontu Technologies · Applications Support</p>
        </div>
      </section>
    </div>
  );
}
