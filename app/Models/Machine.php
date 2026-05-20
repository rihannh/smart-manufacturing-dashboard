<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Machine extends Model
{
    protected $fillable = [
        'name',
        'type',
        'status',
        'temperature',
        'output_per_minute',
        'current_operator_id',
    ];

    protected $casts = [
        'temperature' => 'decimal:2',
        'output_per_minute' => 'integer',
    ];

    /**
     * Operator yang sedang mengoperasikan mesin ini.
     */
    public function operator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'current_operator_id');
    }

    /**
     * Log produksi milik mesin ini.
     */
    public function productionLogs(): HasMany
    {
        return $this->hasMany(ProductionLog::class);
    }
}
