<?php

namespace App\Policies;

use App\Models\Activity;
use App\Models\User;

class ActivityPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->hasPermission(PERMISSIONS['VIEW_ACTIVITIES']);
    }

    public function manage(User $user): bool
    {
        return $user->hasPermission(PERMISSIONS['MODIFY_ACTIVITIES']);
    }

    public function updateStatus(User $user, Activity $activity): bool
    {
        return $activity->is_active
            && $user->hasPermission(PERMISSIONS['UPDATE_ACTIVITY_STATUS']);
    }
}
