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
import type { User } from '@/types';

interface CreateMachineProps {
    users: Array<Pick<User, 'id' | 'name'>>;
    types: string[];
}

export default function MachinesCreate() {
    const { users, types } = usePage<{ props: CreateMachineProps }>().props as unknown as CreateMachineProps;

    const form = useForm({
        name: '',
        type: '' as string,
        current_operator_id: '' as string,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        form.post('/machines');
    };

    return (
        <>
            <Head title="Tambah Mesin" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <Card className="mx-auto w-full max-w-lg">
                    <CardHeader>
                        <CardTitle>Tambah Mesin Baru</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-1.5">
                                <Label htmlFor="name">Nama Mesin</Label>
                                <Input
                                    id="name"
                                    value={form.data.name}
                                    onChange={(e) => form.setData('name', e.target.value)}
                                    placeholder="Contoh: CNC Machine"
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

MachinesCreate.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Mesin', href: '/machines' },
        { title: 'Tambah Mesin', href: '/machines/create' },
    ],
};
