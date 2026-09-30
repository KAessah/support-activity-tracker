<?php

namespace App\Http\Actions\User;

use App\Http\Resources\RoleResource;
use App\Services\UserService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class GetRolesAction
{
    private UserService $userService;
    public function __construct(UserService $userService) {
        $this->userService = $userService;
    }

    public function handle(Request $request): JsonResponse
    {
        return toJSONResponse(data: RoleResource::collection($this->userService->assignableRoles($request->user())));
    }
}
