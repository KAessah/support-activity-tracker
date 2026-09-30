<?php

namespace App\Policies;

use App\Models\User;

class UserPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->hasPermission(PERMISSIONS['VIEW_USERS']);
    }

    public function create(User $user): bool
    {
        return $user->hasPermission(PERMISSIONS['MODIFY_USERS']);
    }

    public function update(User $user, User $target): bool
    {
        // Only a super admin may touch another super admin's account.
        if ($target->isSuperAdmin() && ! $user->isSuperAdmin()) {
            return false;
        }

        return $user->hasPermission(PERMISSIONS['MODIFY_USERS']);
    }

    public function toggleStatus(User $user, User $target): bool
    {
        // Nobody can lock themselves out.
        return $user->isNot($target) && $this->update($user, $target);
    }
}
