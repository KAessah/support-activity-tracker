<?php

namespace App\Http\Actions\Activity;

use App\Http\Requests\ActivityRequest;
use App\Http\Resources\ActivityResource;
use App\Models\Activity;
use App\Services\ActivityService;
use Illuminate\Http\JsonResponse;

class UpdateActivityAction
{
    private ActivityService $activityService;
    public function __construct(ActivityService $activityService) {
        $this->activityService = $activityService;
    }

    public function handle(ActivityRequest $request, Activity $activity): JsonResponse
    {
        $activity = $this->activityService->update($activity, $request->validated());

        return toJSONResponse(data: new ActivityResource($activity), message: "Activity \"{$activity->title}\" updated.");
    }
}
