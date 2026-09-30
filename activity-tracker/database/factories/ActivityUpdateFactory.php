<?php

namespace Database\Factories;

use App\Enum\ActivityStatus;
use App\Models\Activity;
use App\Models\ActivityUpdate;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<ActivityUpdate>
 */
class ActivityUpdateFactory extends Factory
{
    public function definition(): array
    {
        return [
            'activity_id' => Activity::factory(),
            'user_id' => User::factory(),
            'activity_date' => today()->toDateString(),
            'status' => ActivityStatus::DONE,
            'remark' => fake()->sentence(),
            'personnel_snapshot' => fn (array $attributes) => User::query()->find($attributes['user_id'])->toPersonnelSnapshot(),
        ];
    }

    public function on(string $date): static
    {
        return $this->state(fn () => ['activity_date' => $date]);
    }

    public function pending(): static
    {
        return $this->state(fn () => ['status' => ActivityStatus::PENDING]);
    }
}
