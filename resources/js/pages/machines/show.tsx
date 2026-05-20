import { Head, usePage } from '@inertiajs/react';
import { MachineCard } from '@/components/machine-card';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Machine, ProductionLog } from '@/types';

interface MachineShowProps {
    machine: Machine & { production_logs: ProductionLog[] };
}

const shiftLabels: Record<string, string> = {
    morning: 'Pagi',
    afternoon: 'Siang',
    night: 'Malam',
};

export default function MachinesShow() {
    const { machine } = usePage<{ props: MachineShowProps }>().props as unknown as MachineShowProps;

    return (
        <>
            <Head title={machine.name} />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="mx-auto w-full max-w-2xl">
                    <MachineCard machine={machine} />
                </div>

                {/* Recent Production Logs */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm">Log Produksi Terbaru</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b bg-muted/50">
                                        <th className="px-4 py-3 text-left font-medium">Waktu</th>
                                        <th className="px-4 py-3 text-left font-medium">Shift</th>
                                        <th className="px-4 py-3 text-left font-medium">Status</th>
                                        <th className="px-4 py-3 text-right font-medium">Suhu</th>
                                        <th className="px-4 py-3 text-right font-medium">Output</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {machine.production_logs?.length === 0 ? (
                                        <tr>
                                            <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                                                Belum ada log produksi.
                                            </td>
                                        </tr>
                                    ) : (
                                        machine.production_logs?.slice(0, 20).map((log) => (
                                            <tr key={log.id} className="border-b">
                                                <td className="px-4 py-2 whitespace-nowrap text-xs">
                                                    {new Date(log.logged_at).toLocaleString('id-ID')}
                                                </td>
                                                <td className="px-4 py-2 text-xs">{shiftLabels[log.shift]}</td>
                                                <td className="px-4 py-2">
                                                    <Badge variant="outline" className="text-xs">{log.status}</Badge>
                                                </td>
                                                <td className="px-4 py-2 text-right text-xs tabular-nums">{log.temperature}°C</td>
                                                <td className="px-4 py-2 text-right text-xs tabular-nums">{log.output_count}</td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

MachinesShow.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Mesin', href: '/machines' },
        { title: 'Detail', href: '#' },
    ],
};
