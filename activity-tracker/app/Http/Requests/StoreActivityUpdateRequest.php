<?php

namespace App\Http\Requests;

use App\Enum\ActivityStatus;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreActivityUpdateRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'status' => ['required', Rule::enum(ActivityStatus::class)],
            'remark' => ['nullable', 'string', 'max:1000', 'required_if:status,'.ActivityStatus::PENDING->value],
        ];
    }

    public function messages(): array
    {
        return [
            'remark.required_if' => 'Please add a remark explaining why this activity is still pending.',
        ];
    }
}
