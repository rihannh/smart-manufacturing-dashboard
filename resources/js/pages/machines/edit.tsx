import { Head, useForm, usePage } from '@inertiajs/react';
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
import type { Machine, User } from '@/types';

interface EditMachineProps {
    machine: Machine;
    users: Array<Pick<User, 'id' | 'name'>>;
    types: string[];
}

export default function MachinesEdit() {
    const { machine, users, types } = usePage<{ props: EditMachineProps }>().props as unknown as EditMachineProps;

    const form = useForm({
        name: machine.name,
        type: machine.type as string,
        current_operator_id: machine.current_operator_id ? String(machine.current_operator_id) : '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        form.put(`/machines/${machine.id}`);
    };

    return (
        <>
            <Head title={`Edit — ${machine.name}`} />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <Card className="mx-auto w-full max-w-lg">
                    <CardHeader>
                        <CardTitle>Edit Mesin — {machine.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-1.5">
                                <Label htmlFor="name">Nama Mesin</Label>
                                <Input
                                    id="name"
                                    value={form.data.name}
                                    onChange={(e) => form.setData('name', e.target.value)}
                                />
                                {form.errors.name && (
                                    <p className="text-sm text-red-500">{form.errors.name}</p>
                                )}
                            </div>

                            <div className="space-y-1.5">
                                <Label>Tipe Mesin</Label>
                                <Select
                                    value={form.data.type}
                                    onValueChange={(v) => form.setData('type', v)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Pilih tipe mesin" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {types.map((type) => (
                                            <SelectItem key={type} value={type}>
                                                {type}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {form.errors.type && (
                                    <p className="text-sm text-red-500">{form.errors.type}</p>
                                )}
                            </div>

                            <div className="space-y-1.5">
                                <Label>Operator</Label>
                                <Select
                                    value={form.data.current_operator_id}
                                    onValueChange={(v) => form.setData('current_operator_id', v === 'none' ? '' : v)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Pilih operator (opsional)" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="none">Tidak ada</SelectItem>
                                        {users.map((user) => (
                                            <SelectItem key={user.id} value={String(user.id)}>
                                                {user.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {form.errors.current_operator_id && (
                                    <p className="text-sm text-red-500">{form.errors.current_operator_id}</p>
                                )}
                            </div>

                            <div className="flex gap-2 pt-2">
                                <Button type="submit" disabled={form.processing}>
                                    Simpan
                                </Button>
                                <Button type="button" variant="outline" onClick={() => window.history.back()}>
                                    Batal
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

MachinesEdit.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Mesin', href: '/machines' },
        { title: 'Edit Mesin', href: '#' },
    ],
};
