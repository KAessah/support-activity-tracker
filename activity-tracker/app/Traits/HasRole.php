<?php

namespace App\Traits;

use App\Models\Role;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

trait HasRole
{
    public function role(): BelongsTo
    {
        return $this->belongsTo(Role::class);
    }

    public function hasAnyRole(array $roles): bool
    {
        $this->loadMissing('role');

        return in_array($this->role?->name, $roles, true);
    }

    public function isSuperAdmin(): bool
    {
        return $this->hasAnyRole([ROLES['SUPER_ADMIN']]);
    }

    public function hasPermission(string $permission): bool
    {
        if ($this->isSuperAdmin()) {
            return true;
        }

        // Loaded once per request, then reused for every gate check.
        $this->loadMissing('role.permissions');

        return (bool) $this->role?->permissions->contains('name', $permission);
    }

    /**
     * Effective permission names, used by clients to shape navigation.
     */
    public function permissionNames(): array
    {
        if ($this->isSuperAdmin()) {
            return array_values(PERMISSIONS);
        }

        $this->loadMissing('role.permissions');

        return $this->role?->permissions->pluck('name')->values()->all() ?? [];
    }
}
