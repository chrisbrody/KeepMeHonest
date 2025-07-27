export interface Goal {
    id: string;
    user_id: string;
    title: string;
    reasons?: string[] | null;
    time1?: string | null;
    time2?: string | null;
    time3?: string | null;
    created_at: string;
    updated_at?: string;
    is_active: boolean;
}

export interface CheckIn {
    id: string;
    user_id: string;
    goal_id: string;
    checked_on: string;
    created_at: string;
}

export interface GoalWithCheckins extends Goal {
    checkin_count?: number;
    currentStreak?: number;
    checkedInToday?: boolean;
}