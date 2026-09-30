<?php

namespace Tests\Feature;

use App\Models\Activity;
use App\Models\Role;
use Tests\TestCase;

class AuthorizationTest extends TestCase
{
    public function test_support_personnel_cannot_manage_activities_or_users(): void
    {
        $this->signIn($this->userWithRole(ROLES['SUPPORT']));
        $activity = Activity::factory()->create();

        $this->getJson('/v1/activities')->assertForbidden();
        $this->postJson('/v1/activities', ['title' => 'New'])->assertForbidden();
        $this->patchJson("/v1/activities/{$activity->id}/toggle-status")->assertForbidden();
        $this->getJson('/v1/users')->assertForbidden();
        $this->postJson('/v1/users', [])->assertForbidden();
    }

    public function test_admin_can_create_and_retire_activities(): void
    {
        $admin = $this->signIn($this->userWithRole(ROLES['ADMIN']));

        $id = $this->postJson('/v1/activities', ['title' => 'Check USSD uptime', 'category' => 'Monitoring'])
            ->assertCreated()
            ->assertJsonPath('data.title', 'Check USSD uptime')
            ->json('data.id');

        $this->assertSame($admin->id, Activity::query()->find($id)->created_by);

        $this->patchJson("/v1/activities/{$id}/toggle-status")->assertJsonPath('data.isActive', false);
    }

    public function test_activity_titles_are_unique(): void
    {
        $this->signIn($this->userWithRole(ROLES['ADMIN']));
        Activity::factory()->create(['title' => 'Daily SMS count']);

        $this->postJson('/v1/activities', ['title' => 'Daily SMS count'])
            ->assertUnprocessable()
            ->assertJsonStructure(['data' => ['title']]);
    }

    public function test_admin_can_add_a_team_member(): void
    {
        $this->signIn($this->userWithRole(ROLES['ADMIN']));
        $supportRole = Role::query()->where('name', ROLES['SUPPORT'])->value('id');

        $this->postJson('/v1/users', [
            'name' => 'Yaw Asante',
            'email' => 'yaw@example.com',
            'staff_id' => 'NPT-050',
            'role_id' => $supportRole,
            'password' => 'secret-pass-123',
            'password_confirmation' => 'secret-pass-123',
        ])->assertCreated()->assertJsonPath('data.staffId', 'NPT-050');

        $this->assertDatabaseHas('users', ['email' => 'yaw@example.com', 'role_id' => $supportRole]);
    }

    public function test_admin_cannot_grant_super_admin_role(): void
    {
        $this->signIn($this->userWithRole(ROLES['ADMIN']));
        $superRole = Role::query()->where('name', ROLES['SUPER_ADMIN'])->value('id');

        $this->postJson('/v1/users', [
            'name' => 'Sneaky', 'email' => 'sneaky@example.com', 'staff_id' => 'NPT-666',
            'role_id' => $superRole, 'password' => 'secret-pass-123', 'password_confirmation' => 'secret-pass-123',
        ])->assertUnprocessable()->assertJsonStructure(['data' => ['role_id']]);
    }

    public function test_admin_cannot_modify_a_super_admin(): void
    {
        $this->signIn($this->userWithRole(ROLES['ADMIN']));
        $superAdmin = $this->userWithRole(ROLES['SUPER_ADMIN']);

        $this->putJson("/v1/users/{$superAdmin->id}", ['name' => 'x'])->assertForbidden();
        $this->patchJson("/v1/users/{$superAdmin->id}/toggle-status")->assertForbidden();
    }

    public function test_users_cannot_deactivate_themselves(): void
    {
        $superAdmin = $this->signIn($this->userWithRole(ROLES['SUPER_ADMIN']));

        $this->patchJson("/v1/users/{$superAdmin->id}/toggle-status")->assertForbidden();
    }

    public function test_deactivating_a_user_revokes_their_tokens(): void
    {
        $this->signIn($this->userWithRole(ROLES['ADMIN']));
        $member = $this->userWithRole(ROLES['SUPPORT']);
        $member->createToken('web');

        $this->patchJson("/v1/users/{$member->id}/toggle-status")->assertJsonPath('data.isActive', false);

        $this->assertSame(0, $member->tokens()->count());
    }

    public function test_super_admin_bypasses_permission_checks(): void
    {
        $superAdmin = $this->userWithRole(ROLES['SUPER_ADMIN']);

        foreach (PERMISSIONS as $permission) {
            $this->assertTrue($superAdmin->hasPermission($permission));
        }
    }

    public function test_user_list_is_paginated_with_standard_meta(): void
    {
        $this->signIn($this->userWithRole(ROLES['ADMIN']));
        $this->userWithRole(ROLES['SUPPORT']);

        $this->getJson('/v1/users?per-page=1')
            ->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('meta.perPage', 1)
            ->assertJsonPath('meta.total', 2)
            ->assertJsonPath('meta.lastPage', 2);
    }
}
