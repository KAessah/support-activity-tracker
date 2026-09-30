<?php

namespace Database\Seeders;

use App\Models\Permission;
use App\Models\Role;
use Illuminate\Database\Seeder;

class RolePermissionSeeder extends Seeder
{
    private const ROLE_DESCRIPTIONS = [
        ROLES['SUPER_ADMIN'] => 'Unrestricted access to the whole system.',
        ROLES['ADMIN'] => 'Team lead: manages activities, personnel and reports.',
        ROLES['SUPPORT'] => 'Applications support personnel: updates daily activities.',
    ];

    /**
     * Super admin is not listed: it bypasses permission checks entirely (see HasRole).
     */
    private const ASSIGNMENTS = [
        ROLES['ADMIN'] => [
            PERMISSIONS['VIEW_ACTIVITIES'],
            PERMISSIONS['MODIFY_ACTIVITIES'],
            PERMISSIONS['UPDATE_ACTIVITY_STATUS'],
            PERMISSIONS['VIEW_REPORTS'],
            PERMISSIONS['VIEW_USERS'],
            PERMISSIONS['MODIFY_USERS'],
        ],
        ROLES['SUPPORT'] => [
            PERMISSIONS['VIEW_ACTIVITIES'],
            PERMISSIONS['UPDATE_ACTIVITY_STATUS'],
            PERMISSIONS['VIEW_REPORTS'],
        ],
    ];

    public function run(): void
    {
        foreach (PERMISSIONS as $name) {
            Permission::query()->firstOrCreate(['name' => $name], ['description' => ucfirst($name)]);
        }

        foreach (ROLES as $name) {
            Role::query()->firstOrCreate(['name' => $name], ['description' => self::ROLE_DESCRIPTIONS[$name]]);
        }

        foreach (self::ASSIGNMENTS as $roleName => $permissionNames) {
            $permissionIds = Permission::query()->whereIn('name', $permissionNames)->pluck('id');
            Role::query()->where('name', $roleName)->firstOrFail()->permissions()->sync($permissionIds);
        }
    }
}
