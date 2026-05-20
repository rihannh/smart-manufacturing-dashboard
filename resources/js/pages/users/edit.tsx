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

interface EditUserProps {
    user: User;
}

export default function UsersEdit() {
    const { user } = usePage<{ props: EditUserProps }>().props as unknown as EditUserProps;

    const form = useForm({
        name: user.name,
        email: user.email,
        role: user.role as string,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        form.put(`/users/${user.id}`);
    };

    return (
        <>
            <Head title={`Edit — ${user.name}`} />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <Card className="mx-auto w-full max-w-lg">
                    <CardHeader>
                        <CardTitle>Edit User — {user.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-1.5">
                                <Label htmlFor="name">Nama</Label>
                                <Input
                                    id="name"
                                    value={form.data.name}
                                    onChange={(e) => form.setData('name', e.target.value)}
                                />
                                {form.errors.name && <p className="text-sm text-red-500">{form.errors.name}</p>}
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={form.data.email}
                                    onChange={(e) => form.setData('email', e.target.value)}
                                />
                                {form.errors.email && <p className="text-sm text-red-500">{form.errors.email}</p>}
                            </div>

                            <div className="space-y-1.5">
                                <Label>Role</Label>
                                <Select
                                    value={form.data.role}
                                    onValueChange={(v) => form.setData('role', v)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Pilih role" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="admin">Admin</SelectItem>
                                        <SelectItem value="operator">Operator</SelectItem>
                                    </SelectContent>
                                </Select>
                                {form.errors.role && <p className="text-sm text-red-500">{form.errors.role}</p>}
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

UsersEdit.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Manajemen User', href: '/users' },
        { title: 'Edit User', href: '#' },
    ],
};
