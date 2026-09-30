<?php

namespace App\Services;

use App\Enum\ActivityStatus;
use App\Models\Activity;
use App\Models\ActivityUpdate;
use App\Models\User;
use Carbon\CarbonInterface;
use Carbon\CarbonPeriod;

class ActivityUpdateService
{
    private const HISTORY_DAYS = 14;

    /**
     * Updates are append-only: every status change is a new row, so the
     * full trail of who did what (and when) is preserved for handover.
     * The date is always set server-side to "today" so it can't be backdated.
     */
    public function record(Activity $activity, User $user, ActivityStatus $status, ?string $remark): ActivityUpdate
    {
        $user->loadMissing('role');

        return $activity->updates()->create([
            'user_id' => $user->id,
            'activity_date' => today()->toDateString(),
            'status' => $status,
            'remark' => $remark,
            'personnel_snapshot' => $user->toPersonnelSnapshot(),
        ]);
    }

    /**
     * One activity on a given day, plus how it ended on each of the previous days.
     */
    public function history(Activity $activity, CarbonInterface $date): array
    {
        $from = $date->copy()->subDays(self::HISTORY_DAYS - 1)->toDateString();
        $day = $date->toDateString();

        $updates = ActivityUpdate::query()
            ->where('activity_id', $activity->id)
            ->whereBetween('activity_date', [$from, $day])
            ->latest()
            ->latest('id')
            ->get();

        $finalByDay = $updates->unique('activity_date')->keyBy('activity_date');

        $trend = collect(CarbonPeriod::create($from, $day))->map(fn (CarbonInterface $d) => [
            'date' => $d->toDateString(),
            'status' => $finalByDay->get($d->toDateString())?->status->value,
            'updates' => $updates->where('activity_date', $d->toDateString())->count(),
        ])->values();

        $activity->setRelation('updates', $updates->where('activity_date', $day)->values());

        return [
            'activity' => $activity,
            'trend' => $trend,
            'stats' => [
                'totalUpdates' => $activity->updates()->count(),
                'daysDone' => $trend->where('status', ActivityStatus::DONE->value)->count(),
                'daysPending' => $trend->where('status', ActivityStatus::PENDING->value)->count(),
                'daysMissed' => $trend->whereNull('status')->count(),
            ],
        ];
    }
}
