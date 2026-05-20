import type { User } from './auth';

export interface Machine {
    id: number;
    name: string;
    type: 'CNC' | 'Milling' | 'Press' | 'Assembly';
    status: 'Running' | 'Idle' | 'Maintenance' | 'Error';
    temperature: number;
    output_per_minute: number;
    current_operator_id: number | null;
    operator?: User;
    created_at: string;
    updated_at: string;
}

export interface ProductionLog {
    id: number;
    machine_id: number;
    machine?: Machine;
    operator_id: number | null;
    operator?: User;
    output_count: number;
    status: string;
    temperature: number;
    shift: 'morning' | 'afternoon' | 'night';
    logged_at: string;
    created_at: string;
    updated_at: string;
}

export interface ShiftReport {
    id: number;
    machine_id: number;
    machine?: Machine;
    shift_date: string;
    shift: 'morning' | 'afternoon' | 'night';
    total_output: number;
    avg_temperature: number;
    uptime_minutes: number;
    downtime_minutes: number;
    created_at: string;
    updated_at: string;
}

export interface PaginatedData<T> {
    data: T[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number | null;
    to: number | null;
    links: Array<{
        url: string | null;
        label: string;
        active: boolean;
    }>;
}
