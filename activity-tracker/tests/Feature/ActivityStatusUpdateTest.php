<?php

namespace Tests\Feature;

use App\Enum\ActivityStatus;
use App\Models\Activity;
use App\Models\ActivityUpdate;
use Tests\TestCase;

class ActivityStatusUpdateTest extends TestCase
{
    public function test_support_personnel_can_mark_an_activity_done_and_their_bio_is_captured(): void
    {
        $this->signIn($this->userWithRole(ROLES['SUPPORT'], ['name' => 'Kofi Boateng', 'staff_id' => 'NPT-003', 'position' => 'Engineer']));
        $activity = Activity::factory()->create();

        $this->postJson("/v1/activities/{$activity->id}/updates", ['status' => 'done', 'remark' => 'Counts match.'])
            ->assertCreated()
            ->assertJsonPath('data.status', 'done')
            ->assertJsonPath('data.personnel.name', 'Kofi Boateng')
            ->assertJsonPath('data.personnel.staffId', 'NPT-003')
            ->assertJsonPath('data.personnel.position', 'Engineer')
            ->assertJsonPath('data.personnel.role', ROLES['SUPPORT']);

        $update = ActivityUpdate::query()->sole();
        $this->assertSame(ActivityStatus::DONE, $update->status);
        $this->assertSame(today()->toDateString(), $update->activity_date);
    }

    public function test_pending_status_requires_a_remark_for_handover(): void
    {
        $this->signIn($this->userWithRole(ROLES['SUPPORT']));
        $activity = Activity::factory()->create();

        $this->postJson("/v1/activities/{$activity->id}/updates", ['status' => 'pending'])
            ->assertUnprocessable()
            ->assertJsonStructure(['data' => ['remark']]);

        $this->assertDatabaseCount('activity_updates', 0);
    }

    public function test_status_must_be_done_or_pending(): void
    {
        $this->signIn($this->userWithRole(ROLES['SUPPORT']));
        $activity = Activity::factory()->create();

        $this->postJson("/v1/activities/{$activity->id}/updates", ['status' => 'skipped'])
            ->assertUnprocessable()
            ->assertJsonStructure(['data' => ['status']]);
    }

    public function test_retired_activities_cannot_be_updated(): void
    {
        $this->signIn($this->userWithRole(ROLES['SUPPORT']));
        $activity = Activity::factory()->inactive()->create();

        $this->postJson("/v1/activities/{$activity->id}/updates", ['status' => 'done'])->assertForbidden();
    }

    public function test_updates_are_appended_so_history_is_kept(): void
    {
        $activity = Activity::factory()->create();

        $this->signIn($this->userWithRole(ROLES['SUPPORT']));
        $this->postJson("/v1/activities/{$activity->id}/updates", ['status' => 'pending', 'remark' => 'Waiting on logs']);

        $this->signIn($this->userWithRole(ROLES['SUPPORT']));
        $this->postJson("/v1/activities/{$activity->id}/updates", ['status' => 'done', 'remark' => 'Picked up and closed']);

        $this->assertDatabaseCount('activity_updates', 2);
    }

    public function test_board_shows_latest_status_stats_and_handover_items(): void
    {
        $user = $this->signIn($this->userWithRole(ROLES['SUPPORT'], ['name' => 'Efua Owusu']));
        $activity = Activity::factory()->create();
        Activity::factory()->create();

        ActivityUpdate::factory()->for($activity)->for($user)->pending()
            ->on(today()->subDay()->toDateString())
            ->create(['remark' => 'Vendor logs not yet received']);

        $this->getJson('/v1/board')
            ->assertOk()
            ->assertJsonPath('data.isToday', true)
            ->assertJsonPath('data.stats.total', 2)
            ->assertJsonPath('data.stats.notUpdated', 2)
            ->assertJsonPath('data.carriedOver.0.remark', 'Vendor logs not yet received');

        $this->postJson("/v1/activities/{$activity->id}/updates", ['status' => 'done', 'remark' => 'Reconciled']);

        $board = $this->getJson('/v1/board')
            ->assertJsonPath('data.stats.done', 1)
            ->assertJsonPath('data.stats.progress', 50)
            ->assertJsonPath('data.timeline.0.personnel.name', 'Efua Owusu');

        $row = collect($board->json('data.activities'))->firstWhere('id', $activity->id);
        $this->assertSame('done', $row['latestUpdate']['status']);
        $this->assertTrue($row['can']['updateStatus']);
    }

    public function test_activity_history_returns_the_day_and_a_14_day_trend(): void
    {
        $user = $this->signIn($this->userWithRole(ROLES['SUPPORT']));
        $activity = Activity::factory()->create();

        ActivityUpdate::factory()->for($activity)->for($user)->on(today()->subDays(2)->toDateString())->create();
        ActivityUpdate::factory()->for($activity)->for($user)->pending()->create();

        $this->getJson("/v1/activities/{$activity->id}")
            ->assertOk()
            ->assertJsonCount(14, 'data.trend')
            ->assertJsonCount(1, 'data.activity.updates')
            ->assertJsonPath('data.stats.daysDone', 1)
            ->assertJsonPath('data.stats.daysPending', 1)
            ->assertJsonPath('data.stats.daysMissed', 12);
    }

    public function test_future_board_dates_fall_back_to_today(): void
    {
        $this->signIn($this->userWithRole(ROLES['SUPPORT']));

        $this->getJson('/v1/board?date='.today()->addDays(3)->toDateString())
            ->assertJsonPath('data.date', today()->toDateString());
    }
}
