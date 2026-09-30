<?php

namespace App\Http\Controllers;

use App\Http\Actions\Activity\GetActivitiesAction;
use App\Http\Actions\Activity\GetActivityHistoryAction;
use App\Http\Actions\Activity\GetActivityOptionsAction;
use App\Http\Actions\Activity\StoreActivityAction;
use App\Http\Actions\Activity\ToggleActivityStatusAction;
use App\Http\Actions\Activity\UpdateActivityAction;
use App\Http\Requests\ActivityRequest;
use App\Models\Activity;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ActivityController extends Controller
{
    public function index(Request $request, GetActivitiesAction $action): JsonResponse
    {
        return $action->handle($request);
    }

    public function options(GetActivityOptionsAction $action): JsonResponse
    {
        return $action->handle();
    }

    public function show(Request $request, Activity $activity, GetActivityHistoryAction $action): JsonResponse
    {
        return $action->handle($request, $activity);
    }

    public function store(ActivityRequest $request, StoreActivityAction $action): JsonResponse
    {
        return $action->handle($request);
    }

    public function update(ActivityRequest $request, Activity $activity, UpdateActivityAction $action): JsonResponse
    {
        return $action->handle($request, $activity);
    }

    public function toggleStatus(Activity $activity, ToggleActivityStatusAction $action): JsonResponse
    {
        return $action->handle($activity);
    }
}
