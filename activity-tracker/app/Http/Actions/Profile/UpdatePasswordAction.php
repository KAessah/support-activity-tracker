<?php

namespace App\Http\Actions\Profile;

use App\Http\Requests\UpdatePasswordRequest;
use App\Services\UserService;
use Illuminate\Http\JsonResponse;

class UpdatePasswordAction
{
    private UserService $userService;
    public function __construct(UserService $userService) {
        $this->userService = $userService;
    }

    public function handle(UpdatePasswordRequest $request): JsonResponse
    {
        $this->userService->update($request->user(), ['password' => $request->validated('password')]);

        return toJSONResponse(message: 'Password changed.');
    }
}
