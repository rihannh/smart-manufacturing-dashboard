<?php

namespace App\Events;

use App\Models\Machine;
use App\Models\ProductionLog;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class MachineDataUpdated implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    /**
     * Create a new event instance.
     */
    public function __construct(public Machine $machine)
    {
        //
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return array<int, Channel>
     */
    public function broadcastOn(): array
    {
        return [
            new Channel('machines'),
            new PrivateChannel('machine.' . $this->machine->id),
        ];
    }

    /**
     * Data yang dikirim bersama broadcast.
     *
     * @return array<string, mixed>
     */
    public function broadcastWith(): array
    {
        return [
            'id'                 => $this->machine->id,
            'name'               => $this->machine->name,
            'type'               => $this->machine->type,
            'status'             => $this->machine->status,
            'temperature'        => (float) $this->machine->temperature,
            'output_per_minute'  => $this->machine->output_per_minute,
            'current_operator'   => $this->machine->operator?->name,
            'updated_at'         => $this->machine->updated_at->toISOString(),
            'total_output_today' => (int) ProductionLog::whereDate('logged_at', today())->sum('output_count'),
        ];
    }
}

