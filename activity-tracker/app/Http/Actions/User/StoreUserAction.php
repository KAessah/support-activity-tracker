<?php

namespace App\Http\Actions\User;

use App\Http\Requests\UserRequest;
use App\Http\Resources\UserResource;
use App\Services\UserService;
use Illuminate\Http\JsonResponse;
use Symfony\Component\HttpFoundation\Response;

class StoreUserAction
{
    private UserService $userService;
    public function __construct(UserService $userService) {
        $this->userService = $userService;
    }

    public function handle(UserRequest $request): JsonResponse
    {
        $user = $this->userService->create($request->validated());

        return toJSONResponse(
            data: new UserResource($user->load('role')),
            message: "{$user->name} has been added to the team.",
            status: Response::HTTP_CREATED,
        );
    }
}
