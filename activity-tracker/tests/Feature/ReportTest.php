<?php

namespace Tests\Feature;

use App\Models\Activity;
use App\Models\ActivityUpdate;
use Tests\TestCase;

class ReportTest extends TestCase
{
    public function test_report_filters_by_custom_date_range(): void
    {
        $user = $this->signIn($this->userWithRole(ROLES['SUPPORT']));
        $activity = Activity::factory()->create();

        ActivityUpdate::factory()->for($activity)->for($user)->on('2026-03-01')->create(['remark' => 'Inside range']);
        ActivityUpdate::factory()->for($activity)->for($user)->on('2026-03-20')->create(['remark' => 'Outside range']);

        $this->getJson('/v1/reports?from=2026-02-25&to=2026-03-05')
            ->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.remark', 'Inside range')
            ->assertJsonPath('meta.total', 1);
    }

    public function test_summary_returns_totals_and_a_daily_trend(): void
    {
        $user = $this->signIn($this->userWithRole(ROLES['SUPPORT']));
        $activity = Activity::factory()->create();

        ActivityUpdate::factory()->for($activity)->for($user)->on('2026-03-01')->create();
        ActivityUpdate::factory()->for($activity)->for($user)->on('2026-03-01')->pending()->create();
        ActivityUpdate::factory()->for($activity)->for($user)->on('2026-03-03')->create();

        $this->getJson('/v1/reports/summary?from=2026-03-01&to=2026-03-03')
            ->assertOk()
            ->assertJsonPath('data.totals.total', 3)
            ->assertJsonPath('data.totals.done', 2)
            ->assertJsonPath('data.totals.pending', 1)
            ->assertJsonPath('data.totals.days', 2)
            ->assertJsonCount(3, 'data.trend')
            ->assertJsonPath('data.trend.0', ['date' => '2026-03-01', 'done' => 1, 'pending' => 1])
            ->assertJsonPath('data.trend.1', ['date' => '2026-03-02', 'done' => 0, 'pending' => 0]);
    }

    public function test_report_filters_by_personnel_and_status(): void
    {
        $kofi = $this->signIn($this->userWithRole(ROLES['SUPPORT']));
        $efua = $this->userWithRole(ROLES['SUPPORT']);
        $activity = Activity::factory()->create();

        ActivityUpdate::factory()->for($activity)->for($kofi)->pending()->create(['remark' => 'Kofi pending']);
        ActivityUpdate::factory()->for($activity)->for($efua)->create(['remark' => 'Efua done']);

        $this->getJson("/v1/reports?user_id={$kofi->id}&status=pending")
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.remark', 'Kofi pending');
    }

    public function test_end_date_cannot_be_before_start_date(): void
    {
        $this->signIn($this->userWithRole(ROLES['SUPPORT']));

        $this->getJson('/v1/reports?from=2026-03-10&to=2026-03-01')
            ->assertUnprocessable()
            ->assertJsonStructure(['data' => ['to']]);
    }

    public function test_report_can_be_exported_as_csv(): void
    {
        $user = $this->signIn($this->userWithRole(ROLES['SUPPORT'], ['staff_id' => 'NPT-777']));
        ActivityUpdate::factory()->for(Activity::factory()->create(['title' => 'SMS reconciliation']))->for($user)->create();

        $response = $this->get('/v1/reports/export');

        $response->assertOk()->assertDownload();
        $csv = $response->streamedContent();
        $this->assertStringContainsString('SMS reconciliation', $csv);
        $this->assertStringContainsString('NPT-777', $csv);
    }
}
