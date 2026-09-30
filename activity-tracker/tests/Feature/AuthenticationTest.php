<?php

namespace Tests\Feature;

use Tests\TestCase;

class AuthenticationTest extends TestCase
{
    public function test_protected_endpoints_require_a_token(): void
    {
        $this->getJson('/v1/board')
            ->assertUnauthorized()
            ->assertJson(['success' => false, 'message' => 'Authentication failed, please log in.']);
    }

    public function test_active_user_receives_a_token_and_profile(): void
    {
        $user = $this->userWithRole(ROLES['SUPPORT']);

        $response = $this->postJson('/v1/auth/login', ['email' => $user->email, 'password' => 'password'])
            ->assertOk()
            ->assertJsonPath('success', true)
            ->assertJsonPath('data.user.email', $user->email)
            ->assertJsonPath('data.user.role', ROLES['SUPPORT']);

        $this->assertContains(PERMISSIONS['UPDATE_ACTIVITY_STATUS'], $response->json('data.user.permissions'));
        $this->assertNotNull($user->fresh()->last_login_at);

        $this->withToken($response->json('data.token'))->getJson('/v1/auth/me')->assertOk();
    }

    public function test_wrong_password_is_rejected(): void
    {
        $user = $this->userWithRole(ROLES['SUPPORT']);

        $this->postJson('/v1/auth/login', ['email' => $user->email, 'password' => 'wrong'])
            ->assertUnauthorized()
            ->assertJsonPath('success', false);
    }

    public function test_deactivated_user_cannot_sign_in(): void
    {
        $user = $this->userWithRole(ROLES['SUPPORT'], ['is_active' => false]);

        $this->postJson('/v1/auth/login', ['email' => $user->email, 'password' => 'password'])->assertUnauthorized();
    }

    public function test_token_of_a_user_deactivated_later_is_rejected(): void
    {
        $user = $this->userWithRole(ROLES['SUPPORT']);
        $token = $user->createToken('web')->plainTextToken;
        $user->update(['is_active' => false]);

        $this->withToken($token)->getJson('/v1/board')
            ->assertUnauthorized()
            ->assertJsonPath('message', 'Your account has been deactivated.');

        $this->assertSame(0, $user->tokens()->count());
    }

    public function test_logout_revokes_the_token(): void
    {
        $user = $this->userWithRole(ROLES['SUPPORT']);
        $token = $user->createToken('web')->plainTextToken;

        $this->withToken($token)->postJson('/v1/auth/logout')->assertOk();

        $this->assertSame(0, $user->tokens()->count());
    }

    public function test_login_is_rate_limited(): void
    {
        $user = $this->userWithRole(ROLES['SUPPORT']);

        foreach (range(1, 5) as $ignored) {
            $this->postJson('/v1/auth/login', ['email' => $user->email, 'password' => 'wrong']);
        }

        $this->postJson('/v1/auth/login', ['email' => $user->email, 'password' => 'password'])->assertTooManyRequests();
    }

    public function test_validation_errors_use_the_standard_envelope(): void
    {
        $this->postJson('/v1/auth/login', [])
            ->assertUnprocessable()
            ->assertJsonPath('success', false)
            ->assertJsonPath('message', 'Validation error.')
            ->assertJsonStructure(['data' => ['email', 'password'], 'meta']);
    }
}
