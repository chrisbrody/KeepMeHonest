// app/dashboard/types/activity.ts

export interface Activity {
    activity_event_id: string;
    activity_type: string;
    billable: boolean;
    billable_rate: number;
    billable_status: string;
    calendar_id: string;
    customer_ref_number: string;
    date: string;
    description: string;
    designer_id: string;
    duration: string | null;
    google_event_id: string;
    id: string;
    object: string;
    unit: string;
    activity_start_time?: string | null;
    activity_end_time?: string | null;
    invoice_number: string | null;
    invoice_url: string | null;
}