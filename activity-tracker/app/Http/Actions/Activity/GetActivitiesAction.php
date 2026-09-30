<?php

namespace App\Http\Actions\Activity;

use App\Http\Resources\ActivityResource;
use App\Services\ActivityService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class GetActivitiesAction
{
    private ActivityService $activityService;
    public function __construct(ActivityService $activityService) {
        $this->activityService = $activityService;
    }

    public function handle(Request $request): JsonResponse
    {
        $activities = $this->activityService->paginate($request->only(['search', 'status']), perPage());

        return toJSONResponse(data: ActivityResource::collection($activities), meta: pagination($activities));
    }
}
