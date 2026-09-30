<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable(['title', 'description', 'category', 'is_active', 'created_by'])]
class Activity extends BaseModel
{
    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
        ];
    }

    public function updates(): HasMany
    {
        return $this->hasMany(ActivityUpdate::class);
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function scopeActive(Builder $query): Builder
    {
        return $query->where('is_active', true);
    }
}
