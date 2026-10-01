<?php

namespace Database\Seeders;

use App\Enum\ActivityStatus;
use App\Models\Activity;
use App\Models\ActivityUpdate;
use App\Models\Role;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Arr;

/**
 * Sample team, activities and two weeks of history so the board and
 * reports have something to show. Only seeded outside production.
 */
class DemoDataSeeder extends Seeder
{
    private const ACTIVITIES = [
        ['Daily SMS count in comparison to SMS count from logs', 'Reconciliation', 'Compare the SMS count on the dashboard against the count derived from gateway logs and flag any variance.'],
        ['Check USSD session success rate', 'Monitoring', 'Confirm USSD session success rate is above 98% for the past 24 hours.'],
        ['Verify mobile money callback reconciliation', 'Reconciliation', 'Match payment callbacks received against transactions initiated.'],
        ['Review application error logs', 'Monitoring', 'Scan production error logs for new or recurring exceptions.'],
        ['Confirm overnight database backups', 'Infrastructure', 'Verify backup jobs completed and archives are restorable.'],
        ['Check server disk & memory usage', 'Infrastructure', 'Ensure no server is above 80% disk or memory utilisation.'],
        ['Follow up on escalated support tickets', 'Incident Management', 'Review open escalations and update clients on progress.'],
        ['Send daily service health summary', 'Reporting', 'Circulate the daily health summary to stakeholders.'],
    ];

    private const REMARKS = [
        ActivityStatus::DONE->value => ['All figures match.', 'Completed, no issues found.', 'Variance of 0.2% — within tolerance.', 'Done and shared with the team.'],
        ActivityStatus::PENDING->value => ['Waiting on logs from the vendor.', 'Server access issue, escalated to infra.', 'Partially done, will continue after lunch.', 'Variance found, investigating.'],
    ];

    public function run(): void
    {
        $roles = Role::query()->pluck('id', 'name');

        $team = collect([
            ['Ama Mensah', 'ama@npontu.test', 'NPT-002', 'Team Lead', ROLES['ADMIN']],
            ['Kofi Boateng', 'kofi@npontu.test', 'NPT-003', 'Applications Support Engineer', ROLES['SUPPORT']],
            ['Efua Owusu', 'efua@npontu.test', 'NPT-004', 'Applications Support Engineer', ROLES['SUPPORT']],
            ['Yaw Asante', 'yaw@npontu.test', 'NPT-005', 'Applications Support Analyst', ROLES['SUPPORT']],
        ])->map(fn (array $member) => User::query()->firstOrCreate(['email' => $member[1]], [
            'name' => $member[0],
            'staff_id' => $member[2],
            'position' => $member[3],
            'phone' => sprintf('+233 24 %03d %04d', random_int(0, 999), random_int(0, 9999)),
            'role_id' => $roles[$member[4]],
            'password' => 'password',
        ])->load('role'));

        $activities = collect(self::ACTIVITIES)->map(fn (array $a) => Activity::query()->firstOrCreate(
            ['title' => $a[0]],
            ['category' => $a[1], 'description' => $a[2], 'created_by' => $team->first()->id],
        ));

        if (ActivityUpdate::query()->exists()) {
            return;
        }

        // History for the last 14 days, plus a partially-worked "today".
        foreach (range(14, 0) as $daysAgo) {
            $day = today()->subDays($daysAgo);

            foreach ($activities as $activity) {
                if ($daysAgo === 0 && $this->chance(40)) {
                    continue;
                }

                $this->seedDay($activity, $team, $day, finishPending: $daysAgo > 1);
            }
        }
    }

    private function seedDay(Activity $activity, $team, $day, bool $finishPending): void
    {
        $time = $day->copy()->setTime(8, 0)->addMinutes(random_int(0, 180));
        $status = $this->chance(70) ? ActivityStatus::DONE : ActivityStatus::PENDING;

        $this->record($activity, $team->random(), $day, $status, $time);

        // Most pending items get picked up and closed later in the day by someone else (handover).
        if ($status === ActivityStatus::PENDING && ($finishPending || $this->chance(50))) {
            $this->record($activity, $team->random(), $day, ActivityStatus::DONE, $time->copy()->addHours(random_int(2, 6)));
        }
    }

    private function record(Activity $activity, User $user, $day, ActivityStatus $status, $time): void
    {
        $time = $time->min(now());

        ActivityUpdate::query()->create([
            'activity_id' => $activity->id,
            'user_id' => $user->id,
            'activity_date' => $day->toDateString(),
            'status' => $status,
            'remark' => Arr::random(self::REMARKS[$status->value]),
            'personnel_snapshot' => $user->toPersonnelSnapshot(),
        ])->forceFill(['created_at' => $time, 'updated_at' => $time])->saveQuietly();
    }

    /**
     * True roughly $percent% of the time. Plain PHP (not Faker) because Faker
     * is a dev dependency and this seeder also runs in the production image.
     */
    private function chance(int $percent): bool
    {
        return random_int(1, 100) <= $percent;
    }
}
