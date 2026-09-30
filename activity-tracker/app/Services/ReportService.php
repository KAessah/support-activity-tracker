<?php

namespace App\Services;

use App\Enum\ActivityStatus;
use App\Models\ActivityUpdate;
use Carbon\CarbonInterface;
use Carbon\CarbonPeriod;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\LazyCollection;

class ReportService
{
    public function paginate(array $filters, int $perPage = 10): LengthAwarePaginator
    {
        return $this->query($filters)
            ->with('activity:id,title,category')
            ->paginate($perPage)
            ->withQueryString();
    }

    public function summary(array $filters): array
    {
        $row = $this->query($filters)
            ->reorder()
            ->selectRaw('COUNT(*) as total')
            ->selectRaw('SUM(CASE WHEN status = ? THEN 1 ELSE 0 END) as done', [ActivityStatus::DONE->value])
            ->selectRaw('SUM(CASE WHEN status = ? THEN 1 ELSE 0 END) as pending', [ActivityStatus::PENDING->value])
            ->selectRaw('COUNT(DISTINCT user_id) as personnel')
            ->selectRaw('COUNT(DISTINCT activity_date) as days')
            ->toBase()
            ->first();

        return [
            'total' => (int) $row->total,
            'done' => (int) $row->done,
            'pending' => (int) $row->pending,
            'personnel' => (int) $row->personnel,
            'days' => (int) $row->days,
        ];
    }

    /**
     * Done vs pending counts per day across the filtered range.
     */
    public function trend(array $filters): array
    {
        $rows = $this->query($filters)
            ->reorder()
            ->select('activity_date')
            ->selectRaw('SUM(CASE WHEN status = ? THEN 1 ELSE 0 END) as done', [ActivityStatus::DONE->value])
            ->selectRaw('SUM(CASE WHEN status = ? THEN 1 ELSE 0 END) as pending', [ActivityStatus::PENDING->value])
            ->groupBy('activity_date')
            ->toBase()
            ->get()
            ->keyBy('activity_date');

        return collect(CarbonPeriod::create($filters['from'], $filters['to']))
            ->map(fn (CarbonInterface $day) => [
                'date' => $day->toDateString(),
                'done' => (int) ($rows->get($day->toDateString())->done ?? 0),
                'pending' => (int) ($rows->get($day->toDateString())->pending ?? 0),
            ])
            ->values()
            ->all();
    }

    /**
     * Streams rows in chunks so large exports don't exhaust memory.
     */
    public function cursor(array $filters): LazyCollection
    {
        return $this->query($filters)->with('activity:id,title,category')->lazy(500);
    }

    private function query(array $filters): Builder
    {
        return ActivityUpdate::query()
            ->whereBetween('activity_date', [$filters['from'], $filters['to']])
            ->when($filters['activity_id'] ?? null, fn ($q, $id) => $q->where('activity_id', $id))
            ->when($filters['user_id'] ?? null, fn ($q, $id) => $q->where('user_id', $id))
            ->when($filters['status'] ?? null, fn ($q, $status) => $q->where('status', $status))
            ->orderByDesc('activity_date')
            ->orderByDesc('created_at')
            ->orderByDesc('id');
    }
}
