<?php

namespace App\Http\Actions\Profile;

use App\Http\Requests\UpdateProfileRequest;
use App\Http\Resources\AuthUserResource;
use App\Services\UserService;
use Illuminate\Http\JsonResponse;

class UpdateProfileAction
{
    private UserService $userService;
    public function __construct(UserService $userService) {
        $this->userService = $userService;
    }

    public function handle(UpdateProfileRequest $request): JsonResponse
    {
        $user = $this->userService->update($request->user(), $request->validated());

        return toJSONResponse(data: new AuthUserResource($user->load('role')), message: 'Profile updated.');
    }
}
