<?php

namespace App\Http\Requests;

use App\Enum\ActivityStatus;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ReportFilterRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation(): void
    {
        $this->mergeIfMissing([
            'from' => today()->startOfMonth()->toDateString(),
            'to' => today()->toDateString(),
        ]);
    }

    public function rules(): array
    {
        return [
            'from' => ['required', 'date_format:Y-m-d'],
            'to' => ['required', 'date_format:Y-m-d', 'after_or_equal:from'],
            'activity_id' => ['nullable', 'integer', Rule::exists('activities', 'id')],
            'user_id' => ['nullable', 'integer', Rule::exists('users', 'id')],
            'status' => ['nullable', Rule::enum(ActivityStatus::class)],
        ];
    }
}
