<?php

namespace App\Http\Actions\Activity;

use App\Http\Requests\ActivityRequest;
use App\Http\Resources\ActivityResource;
use App\Services\ActivityService;
use Illuminate\Http\JsonResponse;
use Symfony\Component\HttpFoundation\Response;

class StoreActivityAction
{
    private ActivityService $activityService;
    public function __construct(ActivityService $activityService) {
        $this->activityService = $activityService;
    }

    public function handle(ActivityRequest $request): JsonResponse
    {
        $activity = $this->activityService->create($request->validated(), $request->user());

        return toJSONResponse(
            data: new ActivityResource($activity),
            message: "Activity \"{$activity->title}\" created.",
            status: Response::HTTP_CREATED,
        );
    }
}
