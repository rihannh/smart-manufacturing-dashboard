import { Head, usePage } from '@inertiajs/react';
import { useEchoPublic } from '@laravel/echo-react';
import { Activity, AlertTriangle, TrendingUp, Cpu } from 'lucide-react';
import { useCallback, useState } from 'react';
import { MachineCard } from '@/components/machine-card';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Machine } from '@/types';

interface DashboardProps {
    totalMachines: number;
    machinesRunning: number;
    machinesIdle: number;
    machinesMaintenance: number;
    machinesError: number;
    totalOutputToday: number;
    machines: Machine[];
}

interface MachineUpdatePayload {
    id: number;
    name: string;
    type: Machine['type'];
    status: Machine['status'];
    temperature: number;
    output_per_minute: number;
    current_operator: string | null;
    updated_at: string;
    total_output_today: number;
}

export default function Dashboard() {
    const props = usePage<{ props: DashboardProps }>().props as unknown as DashboardProps;

    const [machines, setMachines] = useState<Machine[]>(props.machines);
    const [totalOutput, setTotalOutput] = useState(props.totalOutputToday);

    const handleMachineUpdate = useCallback((e: MachineUpdatePayload) => {
        console.log('[Dashboard] Received MachineDataUpdated:', e);
        setMachines(prev =>
            prev.map(m =>
                m.id === e.id
                    ? {
                        ...m,
                        status: e.status,
                        temperature: e.temperature,
                        output_per_minute: e.output_per_minute,
                        operator: e.current_operator
                            ? { ...m.operator!, name: e.current_operator }
                            : m.operator,
                        updated_at: e.updated_at,
                    }
                    : m,
            ),
        );
        setTotalOutput(e.total_output_today);
    }, []);

    // Subscribe to the public 'machines' channel for realtime updates
    useEchoPublic('machines', 'MachineDataUpdated', handleMachineUpdate, []);

    // Compute live stats from machines state
    const running = machines.filter(m => m.status === 'Running').length;
    const alerts = machines.filter(m => m.status === 'Error' || m.status === 'Maintenance').length;

    return (
        <>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                {/* Stat Cards */}
                <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                    {/* Total Output Hari Ini */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                Total Output Hari Ini
                            </CardTitle>
                            <TrendingUp className="size-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{totalOutput.toLocaleString()}</div>
                            <p className="text-xs text-muted-foreground">unit diproduksi</p>
                        </CardContent>
                    </Card>

                    {/* Mesin Running */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                Mesin Aktif
                            </CardTitle>
                            <Cpu className="size-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                <span className="text-emerald-500">{running}</span>
                                <span className="text-muted-foreground text-lg"> / {machines.length}</span>
                            </div>
                            <p className="text-xs text-muted-foreground">mesin sedang berjalan</p>
                        </CardContent>
                    </Card>

                    {/* Alerts */}
                    <Card className={alerts > 0 ? 'border-amber-500/30' : ''}>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                Peringatan
                            </CardTitle>
                            <AlertTriangle className={`size-4 ${alerts > 0 ? 'text-amber-500' : 'text-muted-foreground'}`} />
                        </CardHeader>
                        <CardContent>
                            <div className={`text-2xl font-bold ${alerts > 0 ? 'text-amber-500' : ''}`}>
                                {alerts}
                            </div>
                            <p className="text-xs text-muted-foreground">mesin Error / Maintenance</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Machine Status Grid */}
                <div>
                    <div className="mb-3 flex items-center gap-2">
                        <Activity className="size-4 text-muted-foreground" />
                        <h2 className="text-sm font-semibold">Status Mesin — Realtime</h2>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        {machines.map(machine => (
                            <MachineCard key={machine.id} machine={machine} />
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}

Dashboard.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: '/dashboard',
        },
    ],
};
