<?php

namespace App\Services;

use App\Models\Role;
use App\Models\User;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;

class UserService
{
    public function paginate(array $filters = [], int $perPage = 10): LengthAwarePaginator
    {
        return User::query()
            ->with('role:id,name')
            ->withCount('activityUpdates')
            ->when($filters['search'] ?? null, fn ($q, $search) => $q->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%")
                    ->orWhere('staff_id', 'like', "%{$search}%");
            }))
            ->orderByDesc('is_active')
            ->orderBy('name')
            ->paginate($perPage)
            ->withQueryString();
    }

    public function counts(): array
    {
        $row = User::query()
            ->selectRaw('COUNT(*) as total')
            ->selectRaw('SUM(CASE WHEN is_active = 1 THEN 1 ELSE 0 END) as active')
            ->toBase()
            ->first();

        return ['active' => (int) $row->active, 'inactive' => (int) $row->total - (int) $row->active];
    }

    public function options(): Collection
    {
        return User::query()->orderBy('name')->get(['id', 'name', 'staff_id']);
    }

    /**
     * Roles the given user is allowed to hand out.
     */
    public function assignableRoles(User $actor): Collection
    {
        return Role::query()
            ->when(! $actor->isSuperAdmin(), fn ($q) => $q->where('name', '!=', ROLES['SUPER_ADMIN']))
            ->orderBy('name')
            ->get(['id', 'name']);
    }

    public function create(array $attributes): User
    {
        return User::query()->create($attributes);
    }

    public function update(User $user, array $attributes): User
    {
        if (blank($attributes['password'] ?? null)) {
            unset($attributes['password']);
        }

        $user->update($attributes);

        return $user;
    }

    public function toggleStatus(User $user): User
    {
        $user->update(['is_active' => ! $user->is_active]);

        // A deactivated account loses every live session immediately.
        if (! $user->is_active) {
            $user->tokens()->delete();
        }

        return $user;
    }
}
