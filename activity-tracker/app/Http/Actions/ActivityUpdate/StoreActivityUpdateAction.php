<?php

namespace App\Http\Actions\ActivityUpdate;

use App\Enum\ActivityStatus;
use App\Http\Requests\StoreActivityUpdateRequest;
use App\Http\Resources\ActivityUpdateResource;
use App\Models\Activity;
use App\Services\ActivityUpdateService;
use Illuminate\Http\JsonResponse;
use Symfony\Component\HttpFoundation\Response;

class StoreActivityUpdateAction
{
    private ActivityUpdateService $updateService;
    public function __construct(ActivityUpdateService $updateService) {
        $this->updateService = $updateService;
    }

    public function handle(StoreActivityUpdateRequest $request, Activity $activity): JsonResponse
    {
        $update = $this->updateService->record(
            $activity,
            $request->user(),
            ActivityStatus::from($request->validated('status')),
            $request->validated('remark'),
        );

        return toJSONResponse(
            data: new ActivityUpdateResource($update->load('activity')),
            message: "\"{$activity->title}\" marked as {$update->status->value}.",
            status: Response::HTTP_CREATED,
        );
    }
}
