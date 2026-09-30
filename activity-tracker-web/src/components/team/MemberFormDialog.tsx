"use client";

import { useState, useTransition, type FormEvent } from "react";
import { saveMember } from "@/actions/team";
import { Button } from "@/components/ui/Button";
import { Field, Input, Select } from "@/components/ui/Form";
import { Modal } from "@/components/ui/Modal";
import { handleError, handleSuccess } from "@/lib/helpers/toast";
import type { Role, TeamMember } from "@/types/Team";

type Props = {
  target: TeamMember | "new" | null;
  roles: Role[];
  onClose: () => void;
};

export function MemberFormDialog({ target, roles, onClose }: Props) {
  const member = target && target !== "new" ? target : null;

  return (
    <Modal open={!!target} onClose={onClose} title={member ? `Edit ${member.name}` : "Add team member"} subtitle="These bio details are stamped on every update the person makes.">
      {target && <MemberForm key={member?.id ?? "new"} member={member} roles={roles} onClose={onClose} />}
    </Modal>
  );
}

function MemberForm({ member, roles, onClose }: { member: TeamMember | null; roles: Role[]; onClose: () => void }) {
  const [form, setForm] = useState({
    name: member?.name ?? "",
    staff_id: member?.staffId ?? "",
    email: member?.email ?? "",
    phone: member?.phone ?? "",
    position: member?.position ?? "",
    role_id: member?.role?.id ?? roles.find((r) => r.name === "support")?.id ?? roles[0]?.id ?? 0,
    password: "",
    password_confirmation: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isPending, startTransition] = useTransition();
  const set = (key: keyof typeof form) => (e: { target: { value: string } }) => setForm({ ...form, [key]: e.target.value });

  function submit(e: FormEvent) {
    e.preventDefault();
    startTransition(async () => {
      const res = await saveMember(member?.id ?? null, { ...form, role_id: Number(form.role_id) });
      if (res.ok) {
        handleSuccess({ message: res.message });
        onClose();
      } else {
        setErrors(res.fieldErrors ?? {});
        if (!res.fieldErrors) handleError({ message: res.message });
      }
    });
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Full name" error={errors.name}><Input required value={form.name} onChange={set("name")} invalid={!!errors.name} /></Field>
        <Field label="Staff ID" error={errors.staff_id}><Input required value={form.staff_id} onChange={set("staff_id")} invalid={!!errors.staff_id} placeholder="NPT-010" /></Field>
        <Field label="Email" error={errors.email}><Input required type="email" value={form.email} onChange={set("email")} invalid={!!errors.email} /></Field>
        <Field label="Phone" error={errors.phone}><Input value={form.phone} onChange={set("phone")} placeholder="+233 24 000 0000" /></Field>
        <Field label="Position" error={errors.position}><Input value={form.position} onChange={set("position")} placeholder="Applications Support Engineer" /></Field>
        <Field label="Role" error={errors.role_id}>
          <Select value={form.role_id} onChange={set("role_id")} className="capitalize">
            {roles.map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}
          </Select>
        </Field>
      </div>

      <div className="border-t border-hairline pt-4">
        <p className="mb-3 text-[13px] text-tertiary">{member ? "Reset password (leave blank to keep the current one)" : "Initial password. Share it with the member securely."}</p>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Password" error={errors.password}>
            <Input type="password" autoComplete="new-password" required={!member} value={form.password} onChange={set("password")} invalid={!!errors.password} />
          </Field>
          <Field label="Confirm password">
            <Input type="password" autoComplete="new-password" required={!member} value={form.password_confirmation} onChange={set("password_confirmation")} />
          </Field>
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
        <Button type="submit" loading={isPending}>{member ? "Save changes" : "Add member"}</Button>
      </div>
    </form>
  );
}
