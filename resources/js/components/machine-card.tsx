import { Thermometer, Gauge, User } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { Machine } from '@/types';

const statusConfig = {
    Running: { color: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/20', dot: 'bg-emerald-500', pulse: true },
    Idle: { color: 'bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/20', dot: 'bg-amber-500', pulse: false },
    Maintenance: { color: 'bg-blue-500/15 text-blue-700 dark:text-blue-400 border-blue-500/20', dot: 'bg-blue-500', pulse: false },
    Error: { color: 'bg-red-500/15 text-red-700 dark:text-red-400 border-red-500/20', dot: 'bg-red-500', pulse: true },
} as const;

interface MachineCardProps {
    machine: Machine;
}

export function MachineCard({ machine }: MachineCardProps) {
    const config = statusConfig[machine.status];

    return (
        <Card className={cn(
            'relative overflow-hidden transition-all duration-300 hover:shadow-md',
            machine.status === 'Error' && 'border-red-500/30',
        )}>
            {/* Subtle animated gradient for Running/Error */}
            {config.pulse && (
                <div className="absolute inset-0 opacity-5">
                    <div className={cn(
                        'absolute inset-0 animate-pulse',
                        machine.status === 'Running' ? 'bg-emerald-500' : 'bg-red-500',
                    )} />
                </div>
            )}

            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">{machine.name}</CardTitle>
                <Badge className={cn('gap-1.5', config.color)}>
                    <span className={cn('size-1.5 rounded-full', config.dot, config.pulse && 'animate-pulse')} />
                    {machine.status}
                </Badge>
            </CardHeader>

            <CardContent className="space-y-3">
                <div className="text-muted-foreground text-xs font-medium uppercase tracking-wide">
                    {machine.type}
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <div className="flex items-center gap-2">
                        <Thermometer className="text-muted-foreground size-4" />
                        <div>
                            <p className="text-xs text-muted-foreground">Suhu</p>
                            <p className={cn(
                                'text-sm font-semibold',
                                machine.temperature >= 95 ? 'text-red-500' :
                                machine.temperature >= 65 ? 'text-amber-500' :
                                'text-emerald-500',
                            )}>
                                {machine.temperature}°C
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <Gauge className="text-muted-foreground size-4" />
                        <div>
                            <p className="text-xs text-muted-foreground">Output</p>
                            <p className="text-sm font-semibold">
                                {machine.output_per_minute} <span className="text-xs font-normal text-muted-foreground">unit/min</span>
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-2 border-t pt-3">
                    <User className="text-muted-foreground size-3.5" />
                    <span className="text-xs text-muted-foreground">
                        {machine.operator?.name ?? 'Tidak ada operator'}
                    </span>
                </div>
            </CardContent>
        </Card>
    );
}
