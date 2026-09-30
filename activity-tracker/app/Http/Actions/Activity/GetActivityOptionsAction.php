<?php

namespace App\Http\Actions\Activity;

use App\Services\ActivityService;
use Illuminate\Http\JsonResponse;

class GetActivityOptionsAction
{
    private ActivityService $activityService;
    public function __construct(ActivityService $activityService) {
        $this->activityService = $activityService;
    }

    public function handle(): JsonResponse
    {
        return toJSONResponse(data: [
            'activities' => $this->activityService->options(),
            'categories' => ACTIVITY_CATEGORIES,
        ]);
    }
}
