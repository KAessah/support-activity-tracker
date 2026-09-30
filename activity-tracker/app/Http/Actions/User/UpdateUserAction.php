<?php

namespace App\Http\Actions\User;

use App\Http\Requests\UserRequest;
use App\Http\Resources\UserResource;
use App\Models\User;
use App\Services\UserService;
use Illuminate\Http\JsonResponse;

class UpdateUserAction
{
    private UserService $userService;
    public function __construct(UserService $userService) {
        $this->userService = $userService;
    }

    public function handle(UserRequest $request, User $user): JsonResponse
    {
        $user = $this->userService->update($user, $request->validated());

        return toJSONResponse(data: new UserResource($user->load('role')), message: "{$user->name}'s account updated.");
    }
}
