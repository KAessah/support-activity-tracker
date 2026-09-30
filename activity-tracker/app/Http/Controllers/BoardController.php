<?php

namespace App\Http\Controllers;

use App\Http\Actions\Board\GetDailyBoardAction;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class BoardController extends Controller
{
    public function index(Request $request, GetDailyBoardAction $action): JsonResponse
    {
        return $action->handle($request);
    }
}
