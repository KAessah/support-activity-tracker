<?php

namespace Database\Seeders;

use App\Models\Role;
use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call(RolePermissionSeeder::class);

        User::query()->firstOrCreate(['email' => env('ADMIN_EMAIL', 'admin@npontu.test')], [
            'name' => 'System Administrator',
            'staff_id' => 'NPT-001',
            'position' => 'Platforms Administrator',
            'role_id' => Role::query()->where('name', ROLES['SUPER_ADMIN'])->value('id'),
            'password' => env('ADMIN_PASSWORD', 'password'),
        ]);

        if (! app()->isProduction()) {
            $this->call(DemoDataSeeder::class);
        }
    }
}
