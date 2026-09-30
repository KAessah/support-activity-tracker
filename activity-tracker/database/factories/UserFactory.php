<?php

namespace Database\Factories;

use App\Models\Role;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

/**
 * @extends Factory<User>
 */
class UserFactory extends Factory
{
    protected static ?string $password;

    public function definition(): array
    {
        return [
            'name' => fake()->name(),
            'email' => fake()->unique()->safeEmail(),
            'staff_id' => 'NPT-'.fake()->unique()->numerify('####'),
            'phone' => fake()->numerify('+233 24 ### ####'),
            'position' => 'Applications Support Engineer',
            'role_id' => fn () => Role::query()->firstOrCreate(['name' => ROLES['SUPPORT']])->id,
            'is_active' => true,
            'email_verified_at' => now(),
            'password' => static::$password ??= Hash::make('password'),
            'remember_token' => Str::random(10),
        ];
    }

    /**
     * Requires RolePermissionSeeder to have run.
     */
    public function withRole(string $role): static
    {
        return $this->state(fn () => [
            'role_id' => Role::query()->where('name', $role)->firstOrFail()->id,
        ]);
    }

    public function inactive(): static
    {
        return $this->state(fn () => ['is_active' => false]);
    }
}
