<?php

namespace App\Http\Actions\Report;

use App\Http\Requests\ReportFilterRequest;
use App\Http\Resources\ActivityUpdateResource;
use App\Services\ReportService;
use Illuminate\Http\JsonResponse;

class GetReportAction
{
    private ReportService $reportService;
    public function __construct(ReportService $reportService) {
        $this->reportService = $reportService;
    }

    public function handle(ReportFilterRequest $request): JsonResponse
    {
        $updates = $this->reportService->paginate($request->validated(), perPage());

        return toJSONResponse(data: ActivityUpdateResource::collection($updates), meta: pagination($updates));
    }
}
