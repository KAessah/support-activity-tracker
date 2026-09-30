<?php

namespace App\Http\Actions\Board;

use App\Http\Resources\ActivityResource;
use App\Http\Resources\ActivityUpdateResource;
use App\Services\DailyBoardService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class GetDailyBoardAction
{
    private DailyBoardService $boardService;
    public function __construct(DailyBoardService $boardService) {
        $this->boardService = $boardService;
    }

    public function handle(Request $request): JsonResponse
    {
        $date = dateOrToday($request->query('date'));
        $board = $this->boardService->forDate($date);

        return toJSONResponse(data: [
            'date' => $date->toDateString(),
            'isToday' => $date->isToday(),
            'stats' => $board['stats'],
            'activities' => ActivityResource::collection($board['activities']),
            'timeline' => ActivityUpdateResource::collection($board['timeline']),
            'carriedOver' => ActivityUpdateResource::collection($board['carriedOver']),
        ]);
    }
}
