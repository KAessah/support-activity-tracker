<?php

namespace App\Http\Resources;

use App\Models\ActivityUpdate;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin ActivityUpdate */
class ActivityUpdateResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'activityId' => $this->activity_id,
            'activity' => $this->whenLoaded('activity', fn () => [
                'id' => $this->activity->id,
                'title' => $this->activity->title,
                'category' => $this->activity->category,
            ]),
            'activityDate' => $this->activity_date,
            'status' => $this->status->value,
            'remark' => $this->remark,
            // Bio details as captured at the moment of the update.
            'personnel' => [
                'id' => $this->user_id,
                'name' => $this->personnel('name'),
                'email' => $this->personnel('email'),
                'staffId' => $this->personnel('staff_id'),
                'phone' => $this->personnel('phone'),
                'position' => $this->personnel('position'),
                'role' => $this->personnel('role'),
            ],
            'createdAt' => $this->created_at->toIso8601String(),
        ];
    }
}
