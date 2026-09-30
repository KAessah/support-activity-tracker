<?php

namespace App\Http\Actions\Activity;

use App\Http\Resources\ActivityResource;
use App\Models\Activity;
use App\Services\ActivityUpdateService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class GetActivityHistoryAction
{
    private ActivityUpdateService $updateService;
    public function __construct(ActivityUpdateService $updateService) {
        $this->updateService = $updateService;
    }

    public function handle(Request $request, Activity $activity): JsonResponse
    {
        $date = dateOrToday($request->query('date'));
        $history = $this->updateService->history($activity, $date);

        return toJSONResponse(data: [
            'date' => $date->toDateString(),
            'isToday' => $date->isToday(),
            'activity' => new ActivityResource($history['activity']),
            'stats' => $history['stats'],
            'trend' => $history['trend'],
        ]);
    }
}
