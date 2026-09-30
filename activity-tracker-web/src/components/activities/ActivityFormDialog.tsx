"use client";

import { useState, useTransition, type FormEvent } from "react";
import { saveActivity } from "@/actions/activities";
import { Button } from "@/components/ui/Button";
import { Field, Input, Select, Textarea } from "@/components/ui/Form";
import { Modal } from "@/components/ui/Modal";
import { handleError, handleSuccess } from "@/lib/helpers/toast";
import type { Activity } from "@/types/Activity";

type Props = {
  /** null = closed, "new" = create, Activity = edit */
  target: Activity | "new" | null;
  categories: string[];
  onClose: () => void;
};

export function ActivityFormDialog({ target, categories, onClose }: Props) {
  const editing = target && target !== "new" ? target : null;

  return (
    <Modal open={!!target} onClose={onClose} title={editing ? "Edit activity" : "New activity"} subtitle="Activities appear on everyone's daily board.">
      {target && <ActivityForm key={editing?.id ?? "new"} activity={editing} categories={categories} onClose={onClose} />}
    </Modal>
  );
}

function ActivityForm({ activity, categories, onClose }: { activity: Activity | null; categories: string[]; onClose: () => void }) {
  const [form, setForm] = useState({
    title: activity?.title ?? "",
    category: activity?.category ?? "",
    description: activity?.description ?? "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isPending, startTransition] = useTransition();

  function submit(e: FormEvent) {
    e.preventDefault();
    startTransition(async () => {
      const res = await saveActivity(activity?.id ?? null, form);
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
      <Field label="Title" error={errors.title}>
        <Input
          required
          maxLength={255}
          value={form.title}
          invalid={!!errors.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          placeholder="e.g. Daily SMS count in comparison to SMS count from logs"
        />
      </Field>
      <Field label="Category" error={errors.category}>
        <Select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
          <option value="">None</option>
          {categories.map((c) => <option key={c}>{c}</option>)}
        </Select>
      </Field>
      <Field label="Description (optional)" error={errors.description} hint="What should be checked, and what counts as done?">
        <Textarea rows={4} maxLength={2000} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
      </Field>
      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
        <Button type="submit" loading={isPending}>{activity ? "Save changes" : "Create activity"}</Button>
      </div>
    </form>
  );
}
