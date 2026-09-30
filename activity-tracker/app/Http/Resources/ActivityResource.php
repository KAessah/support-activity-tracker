<?php

namespace App\Http\Resources;

use App\Models\Activity;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin Activity */
class ActivityResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'description' => $this->description,
            'category' => $this->category,
            'isActive' => $this->is_active,
            'updatesCount' => $this->whenCounted('updates'),
            'createdBy' => $this->whenLoaded('creator', fn () => $this->creator?->name),
            'createdAt' => $this->created_at?->toIso8601String(),
            'latestUpdate' => $this->when(
                $this->resource->relationLoaded('updates'),
                fn () => $this->updates->isNotEmpty() ? new ActivityUpdateResource($this->updates->first()) : null,
            ),
            'updates' => ActivityUpdateResource::collection($this->whenLoaded('updates')),
            'can' => $this->when($request->user() !== null, fn () => [
                'updateStatus' => $request->user()->can('activity.update-status', $this->resource),
            ]),
        ];
    }
}
