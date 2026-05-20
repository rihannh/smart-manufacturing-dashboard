import { Head, Link, router, usePage } from '@inertiajs/react';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { Pagination } from '@/components/pagination';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import type { Machine, PaginatedData, Auth } from '@/types';

interface MachinesIndexProps {
    machines: PaginatedData<Machine>;
    auth: Auth;
}

const statusConfig: Record<string, string> = {
    Running: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/20',
    Idle: 'bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/20',
    Maintenance: 'bg-blue-500/15 text-blue-700 dark:text-blue-400 border-blue-500/20',
    Error: 'bg-red-500/15 text-red-700 dark:text-red-400 border-red-500/20',
};

export default function MachinesIndex() {
    const { machines, auth } = usePage<{ props: MachinesIndexProps }>().props as unknown as MachinesIndexProps;
    const isAdmin = auth.user.role === 'admin';
    const [deleteTarget, setDeleteTarget] = useState<Machine | null>(null);

    const handleDelete = () => {
        if (!deleteTarget) return;
        router.delete(`/machines/${deleteTarget.id}`, {
            onSuccess: () => setDeleteTarget(null),
        });
    };

    return (
        <>
            <Head title="Mesin" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <h1 className="text-lg font-semibold">Daftar Mesin</h1>
                    {isAdmin && (
                        <Button asChild size="sm">
                            <Link href="/machines/create">
                                <Plus className="mr-1 size-3.5" />
                                Tambah Mesin
                            </Link>
                        </Button>
                    )}
                </div>

                {/* Table */}
                <Card>
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b bg-muted/50">
                                        <th className="px-4 py-3 text-left font-medium">Nama</th>
                                        <th className="px-4 py-3 text-left font-medium">Tipe</th>
                                        <th className="px-4 py-3 text-left font-medium">Status</th>
                                        <th className="px-4 py-3 text-right font-medium">Suhu (°C)</th>
                                        <th className="px-4 py-3 text-right font-medium">Output/min</th>
                                        <th className="px-4 py-3 text-left font-medium">Operator</th>
                                        {isAdmin && <th className="px-4 py-3 text-right font-medium">Aksi</th>}
                                    </tr>
                                </thead>
                                <tbody>
                                    {machines.data.length === 0 ? (
                                        <tr>
                                            <td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">
                                                Belum ada mesin.
                                            </td>
                                        </tr>
                                    ) : (
                                        machines.data.map((machine) => (
                                            <tr key={machine.id} className="border-b transition-colors hover:bg-muted/50">
                                                <td className="px-4 py-3 font-medium">{machine.name}</td>
                                                <td className="px-4 py-3">{machine.type}</td>
                                                <td className="px-4 py-3">
                                                    <Badge className={statusConfig[machine.status] ?? 'bg-muted'}>
                                                        {machine.status}
                                                    </Badge>
                                                </td>
                                                <td className="px-4 py-3 text-right tabular-nums">{machine.temperature}</td>
                                                <td className="px-4 py-3 text-right tabular-nums">{machine.output_per_minute}</td>
                                                <td className="px-4 py-3">{machine.operator?.name ?? '-'}</td>
                                                {isAdmin && (
                                                    <td className="px-4 py-3 text-right">
                                                        <div className="flex justify-end gap-1">
                                                            <Button variant="ghost" size="sm" asChild>
                                                                <Link href={`/machines/${machine.id}/edit`}>
                                                                    <Pencil className="size-3.5" />
                                                                </Link>
                                                            </Button>
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() => setDeleteTarget(machine)}
                                                                className="text-red-500 hover:text-red-600"
                                                            >
                                                                <Trash2 className="size-3.5" />
                                                            </Button>
                                                        </div>
                                                    </td>
                                                )}
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>

                <Pagination data={machines} />
            </div>

            {/* Delete Confirmation Dialog */}
            <Dialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Hapus Mesin</DialogTitle>
                        <DialogDescription>
                            Apakah Anda yakin ingin menghapus mesin <strong>{deleteTarget?.name}</strong>?
                            Tindakan ini tidak dapat dibatalkan.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDeleteTarget(null)}>
                            Batal
                        </Button>
                        <Button variant="destructive" onClick={handleDelete}>
                            Hapus
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}

MachinesIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Mesin', href: '/machines' },
    ],
};
