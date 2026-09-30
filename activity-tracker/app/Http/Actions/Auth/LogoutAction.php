<?php

namespace App\Http\Actions\Auth;

use App\Services\AuthService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class LogoutAction
{
    private AuthService $authService;
    public function __construct(AuthService $authService) {
        $this->authService = $authService;
    }

    public function handle(Request $request): JsonResponse
    {
        $this->authService->logout($request->user());

        return toJSONResponse(message: 'Signed out.');
    }
}
