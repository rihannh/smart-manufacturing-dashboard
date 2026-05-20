<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ProductionLog extends Model
{
    protected $fillable = [
        'machine_id',
        'operator_id',
        'output_count',
        'status',
        'temperature',
        'shift',
        'logged_at',
    ];

    protected $casts = [
        'temperature' => 'decimal:2',
        'output_count' => 'integer',
        'logged_at' => 'datetime',
    ];

    /**
     * Mesin yang menghasilkan log ini.
     */
    public function machine(): BelongsTo
    {
        return $this->belongsTo(Machine::class);
    }

    /**
     * Operator yang bertanggung jawab saat log ini dicatat.
     */
    public function operator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'operator_id');
    }
}
