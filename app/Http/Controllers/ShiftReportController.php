<?php

namespace App\Http\Controllers;

use App\Models\Machine;
use App\Models\ProductionLog;
use App\Models\ShiftReport;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ShiftReportController extends Controller
{
    public function index(Request $request): Response
    {
        $reports = ShiftReport::with('machine')
            ->when($request->machine_id, fn ($q, $v) => $q->where('machine_id', $v))
            ->when($request->shift, fn ($q, $v) => $q->where('shift', $v))
            ->when($request->date_from, fn ($q, $v) => $q->whereDate('shift_date', '>=', $v))
            ->when($request->date_to, fn ($q, $v) => $q->whereDate('shift_date', '<=', $v))
            ->orderByDesc('shift_date')
            ->paginate(20)
            ->withQueryString();

        return Inertia::render('shift-reports/index', [
            'reports' => $reports,
            'filters' => $request->only(['machine_id', 'shift', 'date_from', 'date_to']),
        ]);
    }

    public function generate(Request $request): RedirectResponse
    {
        $request->validate([
            'shift_date'  => 'required|date',
            'shift'       => 'required|in:morning,afternoon,night',
            'machine_id'  => 'nullable|exists:machines,id',
        ]);

        $shiftDate = $request->shift_date;
        $shift     = $request->shift;

        // Ambil mesin-mesin yang perlu di-generate
        $machines = $request->machine_id
            ? Machine::where('id', $request->machine_id)->get()
            : Machine::all();

        foreach ($machines as $machine) {
            // Ambil production_logs berdasarkan shift + date + machine
            $logs = ProductionLog::where('machine_id', $machine->id)
                ->where('shift', $shift)
                ->whereDate('logged_at', $shiftDate)
                ->get();

            if ($logs->isEmpty()) {
                continue;
            }

            $totalOutput    = $logs->sum('output_count');
            $avgTemperature = round($logs->avg('temperature'), 2);

            // Hitung uptime (Running) dan downtime (Error/Maintenance)
            // Setiap log merepresentasikan interval dari simulator
            $intervalMinutes = 3 / 60; // default interval simulator = 3 detik ≈ 0.05 menit per log

            $uptimeLogs   = $logs->where('status', 'Running')->count();
            $downtimeLogs = $logs->whereIn('status', ['Error', 'Maintenance'])->count();

            $uptimeMinutes   = (int) round($uptimeLogs * $intervalMinutes);
            $downtimeMinutes = (int) round($downtimeLogs * $intervalMinutes);

            // Upsert ke shift_reports
            ShiftReport::updateOrCreate(
                [
                    'machine_id' => $machine->id,
                    'shift_date' => $shiftDate,
                    'shift'      => $shift,
                ],
                [
                    'total_output'     => $totalOutput,
                    'avg_temperature'  => $avgTemperature,
                    'uptime_minutes'   => $uptimeMinutes,
                    'downtime_minutes' => $downtimeMinutes,
                ]
            );
        }

        return redirect()
            ->route('shift-reports.index')
            ->with('success', 'Shift report berhasil di-generate.');
    }
}
