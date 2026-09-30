<?php

namespace App\Http\Actions\User;

use App\Http\Resources\UserResource;
use App\Models\User;
use App\Services\UserService;
use Illuminate\Http\JsonResponse;

class ToggleUserStatusAction
{
    private UserService $userService;
    public function __construct(UserService $userService) {
        $this->userService = $userService;
    }

    public function handle(User $user): JsonResponse
    {
        $user = $this->userService->toggleStatus($user);
        $state = $user->is_active ? 'activated' : 'deactivated';

        return toJSONResponse(data: new UserResource($user->load('role')), message: "{$user->name}'s account {$state}.");
    }
}
