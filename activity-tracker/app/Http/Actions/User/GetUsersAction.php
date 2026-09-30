<?php

namespace App\Http\Actions\User;

use App\Http\Resources\UserResource;
use App\Services\UserService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class GetUsersAction
{
    private UserService $userService;
    public function __construct(UserService $userService) {
        $this->userService = $userService;
    }

    public function handle(Request $request): JsonResponse
    {
        $users = $this->userService->paginate($request->only('search'), perPage());

        return toJSONResponse(
            data: UserResource::collection($users),
            meta: [...pagination($users), 'counts' => $this->userService->counts()],
        );
    }
}
