<?php

namespace App\Http\Resources;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin User */
class UserResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'email' => $this->email,
            'staffId' => $this->staff_id,
            'phone' => $this->phone,
            'position' => $this->position,
            'isActive' => $this->is_active,
            'role' => new RoleResource($this->whenLoaded('role')),
            'updatesCount' => $this->whenCounted('activityUpdates'),
            'lastLoginAt' => $this->last_login_at?->toIso8601String(),
            'createdAt' => $this->created_at?->toIso8601String(),
            'can' => $this->when($request->user() !== null, fn () => [
                'update' => $request->user()->can('user.update', $this->resource),
                'toggleStatus' => $request->user()->can('user.toggle-status', $this->resource),
            ]),
        ];
    }
}
