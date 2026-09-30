"use client";

import clsx from "clsx";
import { CheckCircle2, Clock3 } from "lucide-react";
import { useState, useTransition, type FormEvent } from "react";
import { recordStatusUpdate } from "@/actions/board";
import { useAccess } from "@/components/reusables/AccessGate";
import { Button } from "@/components/ui/Button";
import { Field, Textarea } from "@/components/ui/Form";
import { Modal } from "@/components/ui/Modal";
import { handleError, handleSuccess } from "@/lib/helpers/toast";
import type { Activity, ActivityStatus } from "@/types/Activity";

type Props = {
  activity: Pick<Activity, "id" | "title" | "latestUpdate"> | null;
  onClose: () => void;
};

const OPTIONS: { value: ActivityStatus; label: string; icon: typeof CheckCircle2; active: string }[] = [
  { value: "done", label: "Done", icon: CheckCircle2, active: "border-emerald-500 bg-status-success-bg text-status-success-fg" },
  { value: "pending", label: "Pending", icon: Clock3, active: "border-amber-500 bg-status-warning-bg text-status-warning-fg" },
];

export function UpdateStatusDialog({ activity, onClose }: Props) {
  return (
    <Modal open={!!activity} onClose={onClose} title="Update status" subtitle={activity?.title}>
      {/* Keyed so the form starts fresh for each activity */}
      {activity && <UpdateForm key={activity.id} activity={activity} onClose={onClose} />}
    </Modal>
  );
}

function UpdateForm({ activity, onClose }: { activity: NonNullable<Props["activity"]>; onClose: () => void }) {
  const { user } = useAccess();
  const [status, setStatus] = useState<ActivityStatus>("done");
  const [remark, setRemark] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [isPending, startTransition] = useTransition();

  function submit(e: FormEvent) {
    e.preventDefault();
    startTransition(async () => {
      const res = await recordStatusUpdate(activity.id, { status, remark });
      if (res.ok) {
        handleSuccess({ message: res.message });
        onClose();
      } else {
        setFieldErrors(res.fieldErrors ?? {});
        if (!res.fieldErrors) handleError({ message: res.message });
      }
    });
  }

  return (
    <form onSubmit={submit} className="space-y-5">
      {activity.latestUpdate?.remark && (
        <div className="rounded-xl bg-surface-muted px-4 py-3 text-[13px]">
          <p className="text-tertiary">Last remark · {activity.latestUpdate.personnel.name}</p>
          <p className="mt-0.5 text-strong">“{activity.latestUpdate.remark}”</p>
        </div>
      )}

      <div className="grid grid-cols-2 gap-3" role="radiogroup" aria-label="Status">
        {OPTIONS.map(({ value, label, icon: Icon, active }) => (
          <button
            key={value}
            type="button"
            role="radio"
            aria-checked={status === value}
            onClick={() => setStatus(value)}
            className={clsx(
              "flex h-12 items-center justify-center gap-2 rounded-xl border-2 text-sm font-medium transition",
              status === value ? active : "border-transparent bg-surface-muted text-tertiary hover:text-strong",
            )}
          >
            <Icon className="size-4" /> {label}
          </button>
        ))}
      </div>

      <Field
        label={status === "pending" ? "Remark (required — what's left for the next person?)" : "Remark (optional)"}
        error={fieldErrors.remark ?? fieldErrors.status}
      >
        <Textarea
          rows={3}
          maxLength={1000}
          required={status === "pending"}
          value={remark}
          onChange={(e) => setRemark(e.target.value)}
          invalid={!!fieldErrors.remark}
          placeholder="e.g. Dashboard shows 12,480 SMS; logs show 12,476, variance within tolerance."
        />
      </Field>

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-hairline pt-4">
        <p className="text-xs text-tertiary">
          Recorded as <span className="text-strong">{user.name}</span> ({user.staffId}) at the time you save.
        </p>
        <div className="flex gap-2">
          <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
          <Button type="submit" loading={isPending}>Save update</Button>
        </div>
      </div>
    </form>
  );
}
