<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\MachineController;
use App\Http\Controllers\ProductionLogController;
use App\Http\Controllers\ShiftReportController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return redirect()->route('dashboard');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // Machines
    Route::resource('machines', MachineController::class);

    // Production Logs (read only)
    Route::get('production-logs', [ProductionLogController::class, 'index'])
         ->name('production-logs.index');

    // Shift Reports
    Route::get('shift-reports', [ShiftReportController::class, 'index'])
         ->name('shift-reports.index');
    Route::post('shift-reports/generate', [ShiftReportController::class, 'generate'])
         ->name('shift-reports.generate');

    // Users (admin only)
    Route::middleware(['admin'])->group(function () {
        Route::resource('users', UserController::class)->except(['show']);
    });
});

require __DIR__.'/settings.php';
