<?php

namespace App\Http\Actions\Activity;

use App\Http\Resources\ActivityResource;
use App\Models\Activity;
use App\Services\ActivityService;
use Illuminate\Http\JsonResponse;

class ToggleActivityStatusAction
{
    private ActivityService $activityService;
    public function __construct(ActivityService $activityService) {
        $this->activityService = $activityService;
    }

    public function handle(Activity $activity): JsonResponse
    {
        $activity = $this->activityService->toggleStatus($activity);
        $state = $activity->is_active ? 'reactivated' : 'retired';

        return toJSONResponse(data: new ActivityResource($activity), message: "Activity \"{$activity->title}\" {$state}.");
    }
}
