<?php

namespace App\Http\Actions\Auth;

use App\Http\Requests\LoginRequest;
use App\Http\Resources\AuthUserResource;
use App\Services\AuthService;
use Illuminate\Http\JsonResponse;
use Symfony\Component\HttpFoundation\Response;

class LoginAction
{
    private AuthService $authService;
    public function __construct(AuthService $authService) {
        $this->authService = $authService;
    }

    public function handle(LoginRequest $request): JsonResponse
    {
        $result = $this->authService->login($request->validated('email'), $request->validated('password'));

        if (! $result) {
            return toJSONResponse(
                success: false,
                message: 'These credentials do not match an active account.',
                status: Response::HTTP_UNAUTHORIZED,
            );
        }

        return toJSONResponse(
            data: ['token' => $result['token'], 'user' => new AuthUserResource($result['user'])],
            message: 'Signed in successfully.',
        );
    }
}
