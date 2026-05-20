<?php

namespace App\Http\Controllers;

use App\Models\ProductionLog;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ProductionLogController extends Controller
{
    public function index(Request $request): Response
    {
        $logs = ProductionLog::with(['machine', 'operator'])
            ->when($request->machine_id, fn ($q, $v) => $q->where('machine_id', $v))
            ->when($request->shift, fn ($q, $v) => $q->where('shift', $v))
            ->when($request->date_from, fn ($q, $v) => $q->whereDate('logged_at', '>=', $v))
            ->when($request->date_to, fn ($q, $v) => $q->whereDate('logged_at', '<=', $v))
            ->orderByDesc('logged_at')
            ->paginate(50)
            ->withQueryString();

        return Inertia::render('production-logs/index', [
            'logs'    => $logs,
            'filters' => $request->only(['machine_id', 'shift', 'date_from', 'date_to']),
        ]);
    }
}
