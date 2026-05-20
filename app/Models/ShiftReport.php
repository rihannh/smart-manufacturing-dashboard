<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ShiftReport extends Model
{
    protected $fillable = [
        'machine_id',
        'shift_date',
        'shift',
        'total_output',
        'avg_temperature',
        'uptime_minutes',
        'downtime_minutes',
    ];

    protected $casts = [
        'shift_date' => 'date',
        'avg_temperature' => 'decimal:2',
        'total_output' => 'integer',
        'uptime_minutes' => 'integer',
        'downtime_minutes' => 'integer',
    ];

    /**
     * Mesin yang terkait dengan laporan shift ini.
     */
    public function machine(): BelongsTo
    {
        return $this->belongsTo(Machine::class);
    }
}
