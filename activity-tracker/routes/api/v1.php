<?php

use App\Http\Controllers\ActivityController;
use App\Http\Controllers\ActivityUpdateController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\BoardController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;

Route::post('auth/login', [AuthController::class, 'login'])->middleware('throttle:login');

Route::middleware(['auth:sanctum', 'active'])->group(function () {
    // Session
    Route::get('auth/me', [AuthController::class, 'me']);
    Route::post('auth/logout', [AuthController::class, 'logout']);

    // Profile
    Route::put('profile', [ProfileController::class, 'update']);
    Route::put('profile/password', [ProfileController::class, 'updatePassword']);

    // Daily board & status updates
    Route::get('board', [BoardController::class, 'index'])->middleware('can:activity.view');
    Route::post('activities/{activity}/updates', [ActivityUpdateController::class, 'store'])
        ->middleware('can:activity.update-status,activity');

    // Activities
    Route::get('activities/options', [ActivityController::class, 'options'])->middleware('can:activity.view');
    Route::get('activities', [ActivityController::class, 'index'])->middleware('can:activity.manage');
    Route::post('activities', [ActivityController::class, 'store'])->middleware('can:activity.manage');
    Route::get('activities/{activity}', [ActivityController::class, 'show'])->middleware('can:activity.view');
    Route::put('activities/{activity}', [ActivityController::class, 'update'])->middleware('can:activity.manage');
    Route::patch('activities/{activity}/toggle-status', [ActivityController::class, 'toggleStatus'])->middleware('can:activity.manage');

    // Reports
    Route::middleware('can:report.view')->group(function () {
        Route::get('reports', [ReportController::class, 'index']);
        Route::get('reports/summary', [ReportController::class, 'summary']);
        Route::get('reports/export', [ReportController::class, 'export']);
        Route::get('users/options', [UserController::class, 'options']);
    });

    // Team
    Route::get('roles', [UserController::class, 'roles'])->middleware('can:user.create');
    Route::get('users', [UserController::class, 'index'])->middleware('can:user.view');
    Route::post('users', [UserController::class, 'store'])->middleware('can:user.create');
    Route::put('users/{user}', [UserController::class, 'update'])->middleware('can:user.update,user');
    Route::patch('users/{user}/toggle-status', [UserController::class, 'toggleStatus'])->middleware('can:user.toggle-status,user');
});
