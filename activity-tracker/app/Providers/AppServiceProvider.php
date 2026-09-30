<?php

namespace App\Providers;

use App\Policies\ActivityPolicy;
use App\Policies\ReportPolicy;
use App\Policies\UserPolicy;
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Str;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        //
    }

    public function boot(): void
    {
        Model::preventLazyLoading(! $this->app->isProduction());

        $this->registerGates();
        $this->registerRateLimiters();
    }

    private function registerGates(): void
    {
        Gate::define('activity.view', [ActivityPolicy::class, 'viewAny']);
        Gate::define('activity.manage', [ActivityPolicy::class, 'manage']);
        Gate::define('activity.update-status', [ActivityPolicy::class, 'updateStatus']);

        Gate::define('report.view', [ReportPolicy::class, 'view']);

        Gate::define('user.view', [UserPolicy::class, 'viewAny']);
        Gate::define('user.create', [UserPolicy::class, 'create']);
        Gate::define('user.update', [UserPolicy::class, 'update']);
        Gate::define('user.toggle-status', [UserPolicy::class, 'toggleStatus']);
    }

    private function registerRateLimiters(): void
    {
        RateLimiter::for('login', function (Request $request) {
            $key = Str::lower((string) $request->input('email')).'|'.$request->ip();

            return Limit::perMinute(5)->by($key);
        });
    }
}
