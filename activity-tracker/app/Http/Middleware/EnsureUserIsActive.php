<?php

namespace App\Http\Middleware;

use App\Services\AuthService;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Rejects a token whose owner was deactivated after it was issued.
 */
class EnsureUserIsActive
{
    private AuthService $authService;
    public function __construct(AuthService $authService) {
        $this->authService = $authService;
    }

    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if ($user && ! $user->is_active) {
            $this->authService->revokeAllTokens($user);

            return toJSONResponse(success: false, message: 'Your account has been deactivated.', status: Response::HTTP_UNAUTHORIZED);
        }

        return $next($request);
    }
}
