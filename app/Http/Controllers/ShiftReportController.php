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

        // Gunakan Aggregate Query untuk menghindari N+1 dan kelebihan RAM
        $aggregateQuery = ProductionLog::selectRaw('
                machine_id,
                SUM(output_count) as total_output,
                AVG(temperature) as avg_temp,
                SUM(CASE WHEN status = "Running" THEN 1 ELSE 0 END) as uptime_logs,
                SUM(CASE WHEN status IN ("Error", "Maintenance") THEN 1 ELSE 0 END) as downtime_logs
            ')
            ->where('shift', $shift)
            ->whereDate('logged_at', $shiftDate);

        if ($request->machine_id) {
            $aggregateQuery->where('machine_id', $request->machine_id);
        }

        $aggregates = $aggregateQuery->groupBy('machine_id')->get();

        $intervalMinutes = 3 / 60; // default interval simulator = 3 detik ≈ 0.05 menit per log

        foreach ($aggregates as $agg) {
            $uptimeMinutes   = (int) round($agg->uptime_logs * $intervalMinutes);
            $downtimeMinutes = (int) round($agg->downtime_logs * $intervalMinutes);

            // Upsert ke shift_reports
            ShiftReport::updateOrCreate(
                [
                    'machine_id' => $agg->machine_id,
                    'shift_date' => $shiftDate,
                    'shift'      => $shift,
                ],
                [
                    'total_output'     => $agg->total_output,
                    'avg_temperature'  => round($agg->avg_temp, 2),
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
