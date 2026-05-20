import { Head, router, usePage } from '@inertiajs/react';
import { Filter } from 'lucide-react';
import { useState } from 'react';
import { Pagination } from '@/components/pagination';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import type { PaginatedData, ProductionLog, Machine } from '@/types';

interface ProductionLogsProps {
    logs: PaginatedData<ProductionLog>;
    filters: {
        machine_id?: string;
        shift?: string;
        date_from?: string;
        date_to?: string;
    };
    machines?: Machine[];
}

const statusConfig: Record<string, string> = {
    Running: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/20',
    Idle: 'bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/20',
    Maintenance: 'bg-blue-500/15 text-blue-700 dark:text-blue-400 border-blue-500/20',
    Error: 'bg-red-500/15 text-red-700 dark:text-red-400 border-red-500/20',
};

const shiftLabels: Record<string, string> = {
    morning: 'Pagi',
    afternoon: 'Siang',
    night: 'Malam',
};

export default function ProductionLogsIndex() {
    const { logs, filters } = usePage<{ props: ProductionLogsProps }>().props as unknown as ProductionLogsProps;

    const [filterState, setFilterState] = useState({
        machine_id: filters.machine_id ?? '',
        shift: filters.shift ?? '',
        date_from: filters.date_from ?? '',
        date_to: filters.date_to ?? '',
    });

    const handleFilter = () => {
        const params: Record<string, string> = {};
        if (filterState.machine_id) params.machine_id = filterState.machine_id;
        if (filterState.shift) params.shift = filterState.shift;
        if (filterState.date_from) params.date_from = filterState.date_from;
        if (filterState.date_to) params.date_to = filterState.date_to;

        router.get('/production-logs', params, { preserveState: true });
    };

    const handleReset = () => {
        setFilterState({ machine_id: '', shift: '', date_from: '', date_to: '' });
        router.get('/production-logs', {}, { preserveState: true });
    };

    return (
        <>
            <Head title="Monitor Produksi" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                {/* Filter Bar */}
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="flex items-center gap-2 text-sm font-medium">
                            <Filter className="size-4" />
                            Filter
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-wrap items-end gap-3">
                            <div className="space-y-1.5">
                                <Label className="text-xs">Mesin</Label>
                                <Select
                                    value={filterState.machine_id}
                                    onValueChange={(v) => setFilterState(s => ({ ...s, machine_id: v === 'all' ? '' : v }))}
                                >
                                    <SelectTrigger className="w-[160px]">
                                        <SelectValue placeholder="Semua mesin" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Semua mesin</SelectItem>
                                        <SelectItem value="1">CNC Machine</SelectItem>
                                        <SelectItem value="2">Milling #1</SelectItem>
                                        <SelectItem value="3">Hydraulic Press</SelectItem>
                                        <SelectItem value="4">Assembly Line</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-1.5">
                                <Label className="text-xs">Shift</Label>
                                <Select
                                    value={filterState.shift}
                                    onValueChange={(v) => setFilterState(s => ({ ...s, shift: v === 'all' ? '' : v }))}
                                >
                                    <SelectTrigger className="w-[140px]">
                                        <SelectValue placeholder="Semua shift" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Semua shift</SelectItem>
                                        <SelectItem value="morning">Pagi</SelectItem>
                                        <SelectItem value="afternoon">Siang</SelectItem>
                                        <SelectItem value="night">Malam</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-1.5">
                                <Label className="text-xs">Dari Tanggal</Label>
                                <Input
                                    type="date"
                                    value={filterState.date_from}
                                    onChange={(e) => setFilterState(s => ({ ...s, date_from: e.target.value }))}
                                    className="w-[160px]"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <Label className="text-xs">Sampai Tanggal</Label>
                                <Input
                                    type="date"
                                    value={filterState.date_to}
                                    onChange={(e) => setFilterState(s => ({ ...s, date_to: e.target.value }))}
                                    className="w-[160px]"
                                />
                            </div>

                            <Button onClick={handleFilter} size="sm">
                                Filter
                            </Button>
                            <Button onClick={handleReset} variant="outline" size="sm">
                                Reset
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Table */}
                <Card>
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b bg-muted/50">
                                        <th className="px-4 py-3 text-left font-medium">Waktu</th>
                                        <th className="px-4 py-3 text-left font-medium">Mesin</th>
                                        <th className="px-4 py-3 text-left font-medium">Operator</th>
                                        <th className="px-4 py-3 text-left font-medium">Shift</th>
                                        <th className="px-4 py-3 text-left font-medium">Status</th>
                                        <th className="px-4 py-3 text-right font-medium">Suhu (°C)</th>
                                        <th className="px-4 py-3 text-right font-medium">Output</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {logs.data.length === 0 ? (
                                        <tr>
                                            <td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">
                                                Tidak ada data produksi.
                                            </td>
                                        </tr>
                                    ) : (
                                        logs.data.map((log) => (
                                            <tr key={log.id} className="border-b transition-colors hover:bg-muted/50">
                                                <td className="px-4 py-3 whitespace-nowrap">
                                                    {new Date(log.logged_at).toLocaleString('id-ID', {
                                                        day: '2-digit',
                                                        month: 'short',
                                                        year: 'numeric',
                                                        hour: '2-digit',
                                                        minute: '2-digit',
                                                    })}
                                                </td>
                                                <td className="px-4 py-3 font-medium">{log.machine?.name ?? '-'}</td>
                                                <td className="px-4 py-3">{log.operator?.name ?? '-'}</td>
                                                <td className="px-4 py-3">{shiftLabels[log.shift] ?? log.shift}</td>
                                                <td className="px-4 py-3">
                                                    <Badge className={statusConfig[log.status] ?? 'bg-muted'}>
                                                        {log.status}
                                                    </Badge>
                                                </td>
                                                <td className="px-4 py-3 text-right tabular-nums">{log.temperature}</td>
                                                <td className="px-4 py-3 text-right tabular-nums">{log.output_count}</td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>

                {/* Pagination */}
                <Pagination data={logs} />
            </div>
        </>
    );
}

ProductionLogsIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Monitor Produksi', href: '/production-logs' },
    ],
};
