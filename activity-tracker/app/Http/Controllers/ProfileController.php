<?php

namespace App\Http\Controllers;

use App\Http\Actions\Profile\UpdatePasswordAction;
use App\Http\Actions\Profile\UpdateProfileAction;
use App\Http\Requests\UpdatePasswordRequest;
use App\Http\Requests\UpdateProfileRequest;
use Illuminate\Http\JsonResponse;

class ProfileController extends Controller
{
    public function update(UpdateProfileRequest $request, UpdateProfileAction $action): JsonResponse
    {
        return $action->handle($request);
    }

    public function updatePassword(UpdatePasswordRequest $request, UpdatePasswordAction $action): JsonResponse
    {
        return $action->handle($request);
    }
}
