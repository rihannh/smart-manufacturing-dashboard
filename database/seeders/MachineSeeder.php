<?php

namespace Database\Seeders;

use App\Models\Machine;
use Illuminate\Database\Seeder;

class MachineSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $machines = [
            ['name' => 'CNC Machine',     'type' => 'CNC'],
            ['name' => 'Milling #1',      'type' => 'Milling'],
            ['name' => 'Hydraulic Press',  'type' => 'Press'],
            ['name' => 'Assembly Line',    'type' => 'Assembly'],
        ];

        foreach ($machines as $machine) {
            Machine::create(array_merge($machine, [
                'status'            => 'Idle',
                'temperature'       => 25.00,
                'output_per_minute' => 0,
            ]));
        }
    }
}
