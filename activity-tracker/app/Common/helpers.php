<?php

use App\Models\User;
use Carbon\CarbonImmutable;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

if (! function_exists('toJSONResponse')) {
    function toJSONResponse(
        mixed $data = [],
        bool $success = true,
        string $message = 'Process completed.',
        int $status = Response::HTTP_OK,
        array $meta = [],
    ): JsonResponse {
        return response()->json([
            'success' => $success,
            'message' => $message,
            'data' => $data,
            'meta' => (object) $meta,
        ], $status);
    }
}

if (! function_exists('pagination')) {
    function pagination(LengthAwarePaginator $paginator): array
    {
        return [
            'prevPageUrl' => $paginator->previousPageUrl(),
            'nextPageUrl' => $paginator->nextPageUrl(),
            'currentPage' => $paginator->currentPage(),
            'firstPage' => 1,
            'lastPage' => $paginator->lastPage(),
            'total' => $paginator->total(),
            'perPage' => $paginator->perPage(),
            'from' => $paginator->firstItem(),
            'to' => $paginator->lastItem(),
        ];
    }
}

if (! function_exists('perPage')) {
    function perPage(int $default = 10): int
    {
        return min(max((int) request()->query('per-page', $default), 1), 100);
    }
}

if (! function_exists('dateOrToday')) {
    /**
     * Parses a Y-m-d string, falling back to today when it is missing, malformed or in the future.
     */
    function dateOrToday(?string $value): CarbonImmutable
    {
        try {
            $date = $value ? CarbonImmutable::createFromFormat('!Y-m-d', $value) : null;
        } catch (Throwable) {
            $date = null;
        }

        return ($date && ! $date->isFuture()) ? $date : CarbonImmutable::today();
    }
}

if (! function_exists('authUser')) {
    function authUser(): ?User
    {
        return Auth::user();
    }
}
