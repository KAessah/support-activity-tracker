<?php

namespace App\Http\Actions\User;

use App\Services\UserService;
use Illuminate\Http\JsonResponse;

class GetUserOptionsAction
{
    private UserService $userService;
    public function __construct(UserService $userService) {
        $this->userService = $userService;
    }

    public function handle(): JsonResponse
    {
        return toJSONResponse(data: $this->userService->options()->map(fn ($user) => [
            'id' => $user->id,
            'name' => $user->name,
            'staffId' => $user->staff_id,
        ]));
    }
}
