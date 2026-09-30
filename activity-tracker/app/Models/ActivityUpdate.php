<?php

namespace App\Models;

use App\Enum\ActivityStatus;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * activity_date is kept as a plain Y-m-d string so equality and range
 * queries stay index-friendly across SQLite and MySQL.
 */
#[Fillable(['activity_id', 'user_id', 'activity_date', 'status', 'remark', 'personnel_snapshot'])]
class ActivityUpdate extends BaseModel
{
    protected function casts(): array
    {
        return [
            'status' => ActivityStatus::class,
            'personnel_snapshot' => 'array',
        ];
    }

    public function activity(): BelongsTo
    {
        return $this->belongsTo(Activity::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function personnel(string $key): ?string
    {
        return $this->personnel_snapshot[$key] ?? null;
    }
}
