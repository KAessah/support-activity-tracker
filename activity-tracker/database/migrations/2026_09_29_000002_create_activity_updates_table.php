<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('activity_updates', function (Blueprint $table) {
            $table->id();
            $table->foreignId('activity_id')->constrained()->restrictOnDelete();
            $table->foreignId('user_id')->constrained()->restrictOnDelete();
            $table->date('activity_date');
            $table->string('status');
            $table->text('remark')->nullable();
            // Bio details of the personnel as they were at the time of the update,
            // so history stays accurate even if the profile changes later.
            $table->json('personnel_snapshot');
            $table->timestamps();

            $table->index(['activity_date', 'activity_id']);
            $table->index(['user_id', 'activity_date']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('activity_updates');
    }
};
