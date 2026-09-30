<?php

namespace App\Http\Actions\Report;

use App\Http\Requests\ReportFilterRequest;
use App\Services\ReportService;
use Illuminate\Http\JsonResponse;

class GetReportSummaryAction
{
    private ReportService $reportService;
    public function __construct(ReportService $reportService) {
        $this->reportService = $reportService;
    }

    public function handle(ReportFilterRequest $request): JsonResponse
    {
        $filters = $request->validated();

        return toJSONResponse(data: [
            'filters' => $filters,
            'totals' => $this->reportService->summary($filters),
            'trend' => $this->reportService->trend($filters),
        ]);
    }
}
