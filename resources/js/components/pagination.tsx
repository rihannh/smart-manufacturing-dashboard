import { Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { PaginatedData } from '@/types';

interface PaginationProps {
    data: PaginatedData<unknown>;
}

export function Pagination({ data }: PaginationProps) {
    if (data.last_page <= 1) return null;

    return (
        <div className="flex items-center justify-between px-2">
            <p className="text-sm text-muted-foreground">
                Menampilkan {data.from ?? 0} - {data.to ?? 0} dari {data.total} data
            </p>
            <div className="flex items-center gap-1">
                {data.links.map((link, i) => (
                    <Button
                        key={i}
                        variant={link.active ? 'default' : 'outline'}
                        size="sm"
                        disabled={!link.url}
                        asChild={!!link.url}
                        className={cn('h-8 min-w-8', !link.url && 'opacity-50')}
                    >
                        {link.url ? (
                            <Link
                                href={link.url}
                                preserveState
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        ) : (
                            <span dangerouslySetInnerHTML={{ __html: link.label }} />
                        )}
                    </Button>
                ))}
            </div>
        </div>
    );
}
