<?php

namespace App\Http\Actions\Report;

use App\Http\Requests\ReportFilterRequest;
use App\Models\ActivityUpdate;
use App\Services\ReportService;
use Symfony\Component\HttpFoundation\StreamedResponse;

class ExportReportAction
{
    private const HEADERS = ['Date', 'Time', 'Activity', 'Category', 'Status', 'Remark', 'Personnel', 'Staff ID', 'Position', 'Email', 'Phone'];

    private ReportService $reportService;

    public function __construct(ReportService $reportService) {

        $this->reportService = $reportService;

    }

    public function handle(ReportFilterRequest $request): StreamedResponse
    {
        $filters = $request->validated();
        $filename = "activity-report_{$filters['from']}_to_{$filters['to']}.csv";

        return response()->streamDownload(function () use ($filters) {
            $out = fopen('php://output', 'w');
            fputcsv($out, self::HEADERS);

            $this->reportService->cursor($filters)->each(fn (ActivityUpdate $update) => fputcsv($out, [
                $update->activity_date,
                $update->created_at->format('H:i:s'),
                $update->activity->title,
                $update->activity->category,
                $update->status->label(),
                $update->remark,
                $update->personnel('name'),
                $update->personnel('staff_id'),
                $update->personnel('position'),
                $update->personnel('email'),
                $update->personnel('phone'),
            ]));

            fclose($out);
        }, $filename, ['Content-Type' => 'text/csv']);
    }
}
