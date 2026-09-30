<?php

namespace App\Http\Controllers;

use App\Http\Actions\Report\ExportReportAction;
use App\Http\Actions\Report\GetReportAction;
use App\Http\Actions\Report\GetReportSummaryAction;
use App\Http\Requests\ReportFilterRequest;
use Illuminate\Http\JsonResponse;
use Symfony\Component\HttpFoundation\StreamedResponse;

class ReportController extends Controller
{
    public function index(ReportFilterRequest $request, GetReportAction $action): JsonResponse
    {
        return $action->handle($request);
    }

    public function summary(ReportFilterRequest $request, GetReportSummaryAction $action): JsonResponse
    {
        return $action->handle($request);
    }

    public function export(ReportFilterRequest $request, ExportReportAction $action): StreamedResponse
    {
        return $action->handle($request);
    }
}
