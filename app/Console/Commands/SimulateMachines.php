<?php

namespace App\Console\Commands;

use App\Events\MachineDataUpdated;
use App\Models\Machine;
use App\Models\ProductionLog;
use Illuminate\Console\Command;

class SimulateMachines extends Command
{
    protected $signature = 'simulate:machines {--interval=3 : Detik antar update}';

    protected $description = 'Simulasi data realtime mesin produksi';

    /**
     * Execute the console command.
     */
    public function handle(): void
    {
        $this->info('Simulator started. Press Ctrl+C to stop.');

        while (true) {
            $machines = Machine::with('operator')->get();

            foreach ($machines as $machine) {
                $status = $this->randomStatus();
                $temp   = $this->randomTemperature($status);
                $output = $this->randomOutput($status);

                // 1. Update machine record
                $machine->update([
                    'status'            => $status,
                    'temperature'       => $temp,
                    'output_per_minute' => $output,
                ]);

                // 2. Simpan ke production_logs
                ProductionLog::create([
                    'machine_id'   => $machine->id,
                    'operator_id'  => $machine->current_operator_id,
                    'output_count' => $output,
                    'status'       => $status,
                    'temperature'  => $temp,
                    'shift'        => $this->getCurrentShift(),
                    'logged_at'    => now(),
                ]);

                // 3. Broadcast ke Reverb
                broadcast(new MachineDataUpdated($machine->refresh()));

                $this->line("Updated: {$machine->name} | {$status} | {$temp}°C | {$output} unit/min");
            }

            sleep((int) $this->option('interval'));
        }
    }

    /**
     * Random status dengan weight realistis.
     * 70% Running, 15% Idle, 10% Maintenance, 5% Error
     */
    private function randomStatus(): string
    {
        $rand = mt_rand(1, 100);

        return match (true) {
            $rand <= 70  => 'Running',
            $rand <= 85  => 'Idle',
            $rand <= 95  => 'Maintenance',
            default      => 'Error',
        };
    }

    /**
     * Random temperature berdasarkan status mesin.
     */
    private function randomTemperature(string $status): float
    {
        [$min, $max] = match ($status) {
            'Running'     => [65, 95],
            'Idle'        => [30, 50],
            'Maintenance' => [20, 35],
            'Error'       => [95, 120],
        };

        return round($min + mt_rand(0, ($max - $min) * 100) / 100, 2);
    }

    /**
     * Random output per minute berdasarkan status mesin.
     */
    private function randomOutput(string $status): int
    {
        return match ($status) {
            'Running' => mt_rand(15, 50),
            default   => 0,
        };
    }

    /**
     * Tentukan shift berdasarkan jam saat ini.
     * morning: 06:00-14:00, afternoon: 14:00-22:00, night: 22:00-06:00
     */
    private function getCurrentShift(): string
    {
        $hour = (int) now()->format('H');

        return match (true) {
            $hour >= 6 && $hour < 14  => 'morning',
            $hour >= 14 && $hour < 22 => 'afternoon',
            default                   => 'night',
        };
    }
}
