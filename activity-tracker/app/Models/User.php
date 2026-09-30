<?php

namespace App\Models;

use App\Traits\HasRole;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

#[Fillable(['name', 'email', 'staff_id', 'phone', 'position', 'role_id', 'is_active', 'last_login_at', 'password'])]
#[Hidden(['password', 'remember_token'])]
class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasApiTokens, HasFactory, HasRole, Notifiable;

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'last_login_at' => 'datetime',
            'is_active' => 'boolean',
            'password' => 'hashed',
        ];
    }

    public function activityUpdates(): HasMany
    {
        return $this->hasMany(ActivityUpdate::class);
    }

    public function scopeActive(Builder $query): Builder
    {
        return $query->where('is_active', true);
    }

    /**
     * Bio details captured against every activity update.
     */
    public function toPersonnelSnapshot(): array
    {
        return [
            'name' => $this->name,
            'email' => $this->email,
            'staff_id' => $this->staff_id,
            'phone' => $this->phone,
            'position' => $this->position,
            'role' => $this->role?->name,
        ];
    }
}
