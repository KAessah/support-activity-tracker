<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ActivityRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:255', Rule::unique('activities', 'title')->ignore($this->route('activity'))],
            'description' => ['nullable', 'string', 'max:2000'],
            'category' => ['nullable', 'string', Rule::in(ACTIVITY_CATEGORIES)],
        ];
    }
}
