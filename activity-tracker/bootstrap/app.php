<?php

use App\Http\Middleware\EnsureUserIsActive;
use App\Http\Middleware\ForceJsonResponse;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Support\Facades\Route;
use Symfony\Component\HttpFoundation\Response;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
        then: function () {
            Route::middleware('api')->prefix('v1')->group(base_path('routes/api/v1.php'));
        },
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->api(prepend: [ForceJsonResponse::class]);

        $middleware->alias([
            'active' => EnsureUserIsActive::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        $exceptions->shouldRenderJsonWhen(fn () => true);

        $exceptions->respond(function (Response $response) {
            $status = $response->getStatusCode();

            if ($status < 400 || ! str_contains((string) $response->headers->get('Content-Type'), 'json')) {
                return $response;
            }

            $original = json_decode($response->getContent(), true) ?? [];
            $body = [];

            $message = match ($status) {
                Response::HTTP_UNPROCESSABLE_ENTITY => 'Validation error.',
                Response::HTTP_UNAUTHORIZED => 'Authentication failed, please log in.',
                Response::HTTP_FORBIDDEN => 'You are not authorized to perform this action.',
                Response::HTTP_NOT_FOUND => 'The requested resource could not be found.',
                Response::HTTP_TOO_MANY_REQUESTS => 'Too many attempts, please wait a minute and try again.',
                default => 'Something went wrong, please try again shortly.',
            };

            if ($status === Response::HTTP_UNPROCESSABLE_ENTITY) {
                $body = $original['errors'] ?? [];
            }

            // Keep our own toJSONResponse payloads untouched (e.g. deactivated account).
            if (array_key_exists('success', $original)) {
                return $response;
            }

            return toJSONResponse(data: $body, success: false, message: $message, status: $status);
        });
    })->create();
