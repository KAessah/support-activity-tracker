<?php

namespace App\Http\Controllers;

use App\Http\Actions\Auth\GetAuthUserAction;
use App\Http\Actions\Auth\LoginAction;
use App\Http\Actions\Auth\LogoutAction;
use App\Http\Requests\LoginRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AuthController extends Controller
{
    public function login(LoginRequest $request, LoginAction $action): JsonResponse
    {
        return $action->handle($request);
    }

    public function me(Request $request, GetAuthUserAction $action): JsonResponse
    {
        return $action->handle($request);
    }

    public function logout(Request $request, LogoutAction $action): JsonResponse
    {
        return $action->handle($request);
    }
}
