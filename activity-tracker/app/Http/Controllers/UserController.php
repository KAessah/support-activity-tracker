<?php

namespace App\Http\Controllers;

use App\Http\Actions\User\GetRolesAction;
use App\Http\Actions\User\GetUserOptionsAction;
use App\Http\Actions\User\GetUsersAction;
use App\Http\Actions\User\StoreUserAction;
use App\Http\Actions\User\ToggleUserStatusAction;
use App\Http\Actions\User\UpdateUserAction;
use App\Http\Requests\UserRequest;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class UserController extends Controller
{
    public function index(Request $request, GetUsersAction $action): JsonResponse
    {
        return $action->handle($request);
    }

    public function options(GetUserOptionsAction $action): JsonResponse
    {
        return $action->handle();
    }

    public function roles(Request $request, GetRolesAction $action): JsonResponse
    {
        return $action->handle($request);
    }

    public function store(UserRequest $request, StoreUserAction $action): JsonResponse
    {
        return $action->handle($request);
    }

    public function update(UserRequest $request, User $user, UpdateUserAction $action): JsonResponse
    {
        return $action->handle($request, $user);
    }

    public function toggleStatus(User $user, ToggleUserStatusAction $action): JsonResponse
    {
        return $action->handle($user);
    }
}
