<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;

class UserRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $user = $this->route('user');

        return [
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', Rule::unique('users', 'email')->ignore($user)],
            'staff_id' => ['required', 'string', 'max:50', Rule::unique('users', 'staff_id')->ignore($user)],
            'phone' => ['nullable', 'string', 'max:20'],
            'position' => ['nullable', 'string', 'max:100'],
            'role_id' => [
                'required',
                'integer',
                // Only a super admin can grant the super admin role.
                Rule::exists('roles', 'id')->when(
                    ! $this->user()->isSuperAdmin(),
                    fn ($rule) => $rule->whereNot('name', ROLES['SUPER_ADMIN']),
                ),
            ],
            'password' => [$user ? 'nullable' : 'required', 'confirmed', Password::defaults()],
        ];
    }
}
