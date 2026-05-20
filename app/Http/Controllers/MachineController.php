<?php

namespace App\Http\Controllers;

use App\Models\Machine;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;
use Inertia\Inertia;
use Inertia\Response;

class MachineController extends Controller implements HasMiddleware
{
    /**
     * Get the middleware that should be assigned to the controller.
     */
    public static function middleware(): array
    {
        return [
            new Middleware('admin', except: ['index', 'show']),
        ];
    }

    /**
     * Display a listing of the resource.
     */
    public function index(): Response
    {
        $machines = Machine::with('operator')
            ->latest()
            ->paginate(10);

        return Inertia::render('machines/index', [
            'machines' => $machines,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response
    {
        return Inertia::render('machines/create', [
            'users' => User::select('id', 'name')->get(),
            'types' => ['CNC', 'Milling', 'Press', 'Assembly'],
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name'                => 'required|string|max:100',
            'type'                => 'required|in:CNC,Milling,Press,Assembly',
            'current_operator_id' => 'nullable|exists:users,id',
        ]);

        Machine::create($validated);

        return redirect()
            ->route('machines.index')
            ->with('success', 'Mesin berhasil ditambahkan.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Machine $machine): Response
    {
        $machine->load('operator', 'productionLogs');

        return Inertia::render('machines/show', [
            'machine' => $machine,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Machine $machine): Response
    {
        return Inertia::render('machines/edit', [
            'machine' => $machine,
            'users'   => User::select('id', 'name')->get(),
            'types'   => ['CNC', 'Milling', 'Press', 'Assembly'],
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Machine $machine): RedirectResponse
    {
        $validated = $request->validate([
            'name'                => 'required|string|max:100',
            'type'                => 'required|in:CNC,Milling,Press,Assembly',
            'current_operator_id' => 'nullable|exists:users,id',
        ]);

        $machine->update($validated);

        return redirect()
            ->route('machines.index')
            ->with('success', 'Mesin berhasil diperbarui.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Machine $machine): RedirectResponse
    {
        $machine->delete();

        return redirect()
            ->route('machines.index')
            ->with('success', 'Mesin berhasil dihapus.');
    }
}
