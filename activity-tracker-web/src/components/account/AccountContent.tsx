"use client";

import { Hash, KeyRound, ShieldCheck } from "lucide-react";
import { useState, useTransition, type FormEvent } from "react";
import { updatePassword, updateProfile } from "@/actions/account";
import { useAccess } from "@/components/reusables/AccessGate";
import { InitialsAvatar } from "@/components/reusables/InitialsAvatar";
import { PageHeader } from "@/components/reusables/PageHeader";
import { Badge } from "@/components/reusables/StatusBadge";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader } from "@/components/ui/Card";
import { Field, Input } from "@/components/ui/Form";
import { handleError, handleSuccess } from "@/lib/helpers/toast";

export function AccountContent() {
  const { user } = useAccess();

  return (
    <>
      <PageHeader title="My Account" subtitle="Your bio details are recorded against every activity update you make." />

      <Card className="mb-4 flex flex-wrap items-center gap-4">
        <InitialsAvatar name={user.name} solid size="lg" />
        <div className="min-w-0 flex-1">
          <h2 className="text-xl font-medium tracking-tight">{user.name}</h2>
          <p className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-[13px] text-tertiary">
            <span className="flex items-center gap-1.5"><Hash className="size-3.5" /> {user.staffId}</span>
            <span>{user.email}</span>
            {user.position && <span>{user.position}</span>}
          </p>
        </div>
        <Badge tone="brand">{user.role}</Badge>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <ProfileForm />
        <PasswordForm />
      </div>
    </>
  );
}

function ProfileForm() {
  const { user } = useAccess();
  const [form, setForm] = useState({ name: user.name, email: user.email, phone: user.phone ?? "", position: user.position ?? "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isPending, startTransition] = useTransition();

  function submit(e: FormEvent) {
    e.preventDefault();
    startTransition(async () => {
      const res = await updateProfile(form);
      setErrors(res.ok ? {} : res.fieldErrors ?? {});
      if (res.ok) handleSuccess({ message: res.message });
      else if (!res.fieldErrors) handleError({ message: res.message });
    });
  }

  return (
    <Card>
      <CardHeader title="Bio details" subtitle="Past updates keep the details you had at the time they were made." />
      <form onSubmit={submit} className="space-y-4">
        <Field label="Full name" error={errors.name}><Input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></Field>
        <Field label="Email" error={errors.email}><Input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Phone" error={errors.phone}><Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></Field>
          <Field label="Position" error={errors.position}><Input value={form.position} onChange={(e) => setForm({ ...form, position: e.target.value })} /></Field>
        </div>
        <div className="flex items-center justify-between gap-3 pt-2">
          <p className="flex items-center gap-1.5 text-[11px] text-tertiary"><ShieldCheck className="size-3.5" /> Staff ID and role are managed by your team lead.</p>
          <Button type="submit" loading={isPending}>Save profile</Button>
        </div>
      </form>
    </Card>
  );
}

function PasswordForm() {
  const empty = { current_password: "", password: "", password_confirmation: "" };
  const [form, setForm] = useState(empty);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isPending, startTransition] = useTransition();

  function submit(e: FormEvent) {
    e.preventDefault();
    startTransition(async () => {
      const res = await updatePassword(form);
      setErrors(res.ok ? {} : res.fieldErrors ?? {});
      if (res.ok) {
        setForm(empty);
        handleSuccess({ message: res.message });
      } else if (!res.fieldErrors) handleError({ message: res.message });
    });
  }

  return (
    <Card className="self-start">
      <CardHeader title="Change password" subtitle="Use at least 8 characters." />
      <form onSubmit={submit} className="space-y-4">
        <Field label="Current password" error={errors.current_password}>
          <Input type="password" autoComplete="current-password" required value={form.current_password} onChange={(e) => setForm({ ...form, current_password: e.target.value })} />
        </Field>
        <Field label="New password" error={errors.password}>
          <Input type="password" autoComplete="new-password" required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        </Field>
        <Field label="Confirm new password">
          <Input type="password" autoComplete="new-password" required value={form.password_confirmation} onChange={(e) => setForm({ ...form, password_confirmation: e.target.value })} />
        </Field>
        <div className="flex justify-end pt-2">
          <Button type="submit" loading={isPending}><KeyRound className="size-4" /> Update password</Button>
        </div>
      </form>
    </Card>
  );
}
