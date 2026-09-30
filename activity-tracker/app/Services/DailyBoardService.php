<?php

namespace App\Services;

use App\Enum\ActivityStatus;
use App\Models\Activity;
use App\Models\ActivityUpdate;
use Carbon\CarbonInterface;
use Illuminate\Support\Collection;

class DailyBoardService
{
    public function forDate(CarbonInterface $date): array
    {
        $day = $date->toDateString();

        // Active activities, plus retired ones that still have history on this day.
        // Each activity's updates are newest-first, so updates->first() is its current status.
        $activities = Activity::query()
            ->where(fn ($q) => $q->active()->orWhereHas('updates', fn ($q) => $q->where('activity_date', $day)))
            ->with(['updates' => fn ($q) => $q->where('activity_date', $day)->latest()->latest('id')])
            ->orderBy('category')
            ->orderBy('title')
            ->get();

        $timeline = ActivityUpdate::query()
            ->with('activity:id,title,category')
            ->where('activity_date', $day)
            ->latest()
            ->latest('id')
            ->get();

        return [
            'activities' => $activities,
            'timeline' => $timeline,
            'stats' => $this->stats($activities),
            'carriedOver' => $this->carriedOver($date->copy()->subDay()->toDateString()),
        ];
    }

    private function stats(Collection $activities): array
    {
        $statuses = $activities->map(fn (Activity $a) => $a->updates->first()?->status);

        $total = $activities->count();
        $done = $statuses->filter(fn ($s) => $s === ActivityStatus::DONE)->count();
        $pending = $statuses->filter(fn ($s) => $s === ActivityStatus::PENDING)->count();

        return [
            'total' => $total,
            'done' => $done,
            'pending' => $pending,
            'notUpdated' => $total - $done - $pending,
            'progress' => $total > 0 ? (int) round($done / $total * 100) : 0,
        ];
    }

    /**
     * Activities whose final state on the previous day was "pending" —
     * this is what the incoming shift needs to pick up.
     */
    private function carriedOver(string $previousDay): Collection
    {
        return ActivityUpdate::query()
            ->with('activity:id,title,category')
            ->where('activity_date', $previousDay)
            ->latest()
            ->latest('id')
            ->get()
            ->unique('activity_id')
            ->filter(fn (ActivityUpdate $update) => $update->status === ActivityStatus::PENDING)
            ->values();
    }
}
