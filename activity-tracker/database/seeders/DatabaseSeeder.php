<?php

namespace Database\Seeders;

use App\Models\Role;
use App\Models\User;
use Illuminate\Database\Seeder;

/**
 * Idempotent: safe to run on every deploy (roles/permissions are synced,
 * users are firstOrCreate'd, demo history is only added once).
 */
class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call(RolePermissionSeeder::class);

        User::query()->firstOrCreate(['email' => config('app.seed.admin_email')], [
            'name' => 'System Administrator',
            'staff_id' => 'NPT-001',
            'position' => 'Platforms Administrator',
            'role_id' => Role::query()->where('name', ROLES['SUPER_ADMIN'])->value('id'),
            'password' => config('app.seed.admin_password'),
        ]);

        if (! app()->isProduction() || config('app.seed.demo')) {
            $this->call(DemoDataSeeder::class);
        }
    }
}
