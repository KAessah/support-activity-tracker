<?php

namespace App\Http\Controllers;

use App\Http\Actions\ActivityUpdate\StoreActivityUpdateAction;
use App\Http\Requests\StoreActivityUpdateRequest;
use App\Models\Activity;
use Illuminate\Http\JsonResponse;

class ActivityUpdateController extends Controller
{
    public function store(StoreActivityUpdateRequest $request, Activity $activity, StoreActivityUpdateAction $action): JsonResponse
    {
        return $action->handle($request, $activity);
    }
}
