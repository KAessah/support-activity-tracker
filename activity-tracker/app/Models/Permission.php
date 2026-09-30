<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

#[Fillable(['name', 'description'])]
class Permission extends BaseModel
{
    public function roles(): BelongsToMany
    {
        return $this->belongsToMany(Role::class);
    }
}
