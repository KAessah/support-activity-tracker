<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Support\Facades\Hash;

class AuthService
{
    /**
     * Returns a bearer token, or null when the credentials are wrong or the
     * account is deactivated. Both cases fail identically so the endpoint
     * never reveals which accounts exist.
     */
    public function login(string $email, string $password): ?array
    {
        $user = User::query()->where('email', $email)->first();

        if (! $user || ! $user->is_active || ! Hash::check($password, $user->password)) {
            return null;
        }

        $user->forceFill(['last_login_at' => now()])->save();

        return [
            'token' => $user->createToken('web')->plainTextToken,
            'user' => $user->load('role'),
        ];
    }

    public function logout(User $user): void
    {
        $user->currentAccessToken()?->delete();
    }

    public function revokeAllTokens(User $user): void
    {
        $user->tokens()->delete();
    }
}
