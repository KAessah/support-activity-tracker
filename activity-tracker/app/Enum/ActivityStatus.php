<?php

namespace App\Enum;

enum ActivityStatus: string
{
    case DONE = 'done';
    case PENDING = 'pending';

    public function label(): string
    {
        return ucfirst($this->value);
    }

    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
}
