import { Head, router, useForm, usePage } from '@inertiajs/react';
import { Filter, FileBarChart, TrendingUp, Thermometer, Clock } from 'lucide-react';
import { useState } from 'react';
import { Pagination } from '@/components/pagination';
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
import type { PaginatedData, ShiftReport } from '@/types';

interface ShiftReportsProps {
    reports: PaginatedData<ShiftReport>;
    filters: {
        machine_id?: string;
        shift?: string;
        date_from?: string;
        date_to?: string;
    };
}

const shiftLabels: Record<string, string> = {
    morning: 'Pagi',
    afternoon: 'Siang',
    night: 'Malam',
};

export default function ShiftReportsIndex() {
    const { reports, filters } = usePage<{ props: ShiftReportsProps }>().props as unknown as ShiftReportsProps;

    const [filterState, setFilterState] = useState({
        machine_id: filters.machine_id ?? '',
        shift: filters.shift ?? '',
        date_from: filters.date_from ?? '',
        date_to: filters.date_to ?? '',
    });

    const generateForm = useForm({
        shift_date: new Date().toISOString().split('T')[0],
        shift: 'morning' as string,
        machine_id: '' as string,
    });

    const handleFilter = () => {
        const params: Record<string, string> = {};
        if (filterState.machine_id) params.machine_id = filterState.machine_id;
        if (filterState.shift) params.shift = filterState.shift;
        if (filterState.date_from) params.date_from = filterState.date_from;
        if (filterState.date_to) params.date_to = filterState.date_to;

        router.get('/shift-reports', params, { preserveState: true });
    };

    const handleReset = () => {
        setFilterState({ machine_id: '', shift: '', date_from: '', date_to: '' });
        router.get('/shift-reports', {}, { preserveState: true });
    };

    const handleGenerate = () => {
        generateForm.post('/shift-reports/generate', { preserveState: true });
    };

    // Summary stats from current page data
    const totalOutput = reports.data.reduce((sum, r) => sum + r.total_output, 0);
    const avgTemp = reports.data.length > 0
        ? (reports.data.reduce((sum, r) => sum + Number(r.avg_temperature), 0) / reports.data.length).toFixed(1)
        : '0';
    const totalUptime = reports.data.reduce((sum, r) => sum + r.uptime_minutes, 0);
    const totalDowntime = reports.data.reduce((sum, r) => sum + r.downtime_minutes, 0);
    const uptimePercent = totalUptime + totalDowntime > 0
        ? ((totalUptime / (totalUptime + totalDowntime)) * 100).toFixed(1)
        : '0';

    return (
        <>
            <Head title="Laporan Shift" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                {/* Filter & Generate */}
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="flex items-center gap-2 text-sm font-medium">
                            <Filter className="size-4" />
                            Filter & Generate
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-wrap items-end gap-3">
                            <div className="space-y-1.5">
                                <Label className="text-xs">Mesin</Label>
                                <Select
                                    value={filterState.machine_id}
                                    onValueChange={(v) => {
                                        const val = v === 'all' ? '' : v;
                                        setFilterState(s => ({ ...s, machine_id: val }));
                                        generateForm.setData('machine_id', val);
                                    }}
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
                                    onValueChange={(v) => {
                                        const val = v === 'all' ? '' : v;
                                        setFilterState(s => ({ ...s, shift: val }));
                                        generateForm.setData('shift', val || 'morning');
                                    }}
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
                                    onChange={(e) => {
                                        setFilterState(s => ({ ...s, date_from: e.target.value }));
                                        generateForm.setData('shift_date', e.target.value);
                                    }}
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
                            <Button
                                onClick={handleGenerate}
                                size="sm"
                                variant="secondary"
                                disabled={generateForm.processing}
                            >
                                <FileBarChart className="mr-1 size-3.5" />
                                Generate Report
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Summary Cards */}
                {reports.data.length > 0 && (
                    <div className="grid gap-4 sm:grid-cols-3">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm font-medium text-muted-foreground">Total Output</CardTitle>
                                <TrendingUp className="size-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{totalOutput.toLocaleString()}</div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm font-medium text-muted-foreground">Avg Temperature</CardTitle>
                                <Thermometer className="size-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{avgTemp}°C</div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm font-medium text-muted-foreground">Uptime</CardTitle>
                                <Clock className="size-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-emerald-500">{uptimePercent}%</div>
                            </CardContent>
                        </Card>
                    </div>
                )}

                {/* Table */}
                <Card>
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b bg-muted/50">
                                        <th className="px-4 py-3 text-left font-medium">Tanggal</th>
                                        <th className="px-4 py-3 text-left font-medium">Mesin</th>
                                        <th className="px-4 py-3 text-left font-medium">Shift</th>
                                        <th className="px-4 py-3 text-right font-medium">Total Output</th>
                                        <th className="px-4 py-3 text-right font-medium">Avg Suhu (°C)</th>
                                        <th className="px-4 py-3 text-right font-medium">Uptime (min)</th>
                                        <th className="px-4 py-3 text-right font-medium">Downtime (min)</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {reports.data.length === 0 ? (
                                        <tr>
                                            <td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">
                                                Belum ada laporan shift. Gunakan tombol "Generate Report" untuk membuat.
                                            </td>
                                        </tr>
                                    ) : (
                                        reports.data.map((report) => (
                                            <tr key={report.id} className="border-b transition-colors hover:bg-muted/50">
                                                <td className="px-4 py-3 whitespace-nowrap">
                                                    {new Date(report.shift_date).toLocaleDateString('id-ID', {
                                                        day: '2-digit',
                                                        month: 'short',
                                                        year: 'numeric',
                                                    })}
                                                </td>
                                                <td className="px-4 py-3 font-medium">{report.machine?.name ?? '-'}</td>
                                                <td className="px-4 py-3">{shiftLabels[report.shift] ?? report.shift}</td>
                                                <td className="px-4 py-3 text-right tabular-nums">{report.total_output.toLocaleString()}</td>
                                                <td className="px-4 py-3 text-right tabular-nums">{report.avg_temperature}</td>
                                                <td className="px-4 py-3 text-right tabular-nums text-emerald-600">{report.uptime_minutes}</td>
                                                <td className="px-4 py-3 text-right tabular-nums text-red-500">{report.downtime_minutes}</td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>

                <Pagination data={reports} />
            </div>
        </>
    );
}

ShiftReportsIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Laporan Shift', href: '/shift-reports' },
    ],
};
