<?php

namespace App\Http\Actions\Auth;

use App\Http\Resources\AuthUserResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class GetAuthUserAction
{
    public function handle(Request $request): JsonResponse
    {
        return toJSONResponse(data: new AuthUserResource($request->user()->load('role')));
    }
}
