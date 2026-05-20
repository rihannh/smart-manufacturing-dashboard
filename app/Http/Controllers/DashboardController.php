<?php

namespace App\Http\Controllers;

use App\Models\Machine;
use App\Models\ProductionLog;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(): Response
    {
        $machines = Machine::with('operator')->get();

        $statusCounts = Machine::toBase()
            ->select('status', \Illuminate\Support\Facades\DB::raw('count(*) as count'))
            ->groupBy('status')
            ->pluck('count', 'status');

        $totalOutputToday = ProductionLog::whereDate('logged_at', today())->sum('output_count');

        return Inertia::render('dashboard', [
            'totalMachines'    => $machines->count(),
            'machinesRunning'  => $statusCounts->get('Running', 0),
            'machinesIdle'     => $statusCounts->get('Idle', 0),
            'machinesMaintenance' => $statusCounts->get('Maintenance', 0),
            'machinesError'    => $statusCounts->get('Error', 0),
            'totalOutputToday' => $totalOutputToday,
            'machines'         => $machines,
        ]);
    }
}
