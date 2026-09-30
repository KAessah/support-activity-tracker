<?php

namespace App\Services;

use App\Models\Activity;
use App\Models\User;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;

class ActivityService
{
    public function paginate(array $filters = [], int $perPage = 10): LengthAwarePaginator
    {
        return Activity::query()
            ->with('creator:id,name')
            ->withCount('updates')
            ->when($filters['search'] ?? null, fn ($q, $search) => $q->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")->orWhere('category', 'like', "%{$search}%");
            }))
            ->when(isset($filters['status']) && $filters['status'] !== '', fn ($q) => $q->where('is_active', $filters['status'] === 'active'))
            ->orderByDesc('is_active')
            ->orderBy('title')
            ->paginate($perPage)
            ->withQueryString();
    }

    public function options(): Collection
    {
        return Activity::query()->orderBy('title')->get(['id', 'title']);
    }

    public function create(array $attributes, User $creator): Activity
    {
        return Activity::query()->create([...$attributes, 'created_by' => $creator->id]);
    }

    public function update(Activity $activity, array $attributes): Activity
    {
        $activity->update($attributes);

        return $activity;
    }

    public function toggleStatus(Activity $activity): Activity
    {
        $activity->update(['is_active' => ! $activity->is_active]);

        return $activity;
    }
}
