import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Goal, GoalWithCheckins, CheckIn } from '../types';

export function useGoals() {
    const [goals, setGoals] = useState<GoalWithCheckins[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [checkingIn, setCheckingIn] = useState<string | null>(null);
    const [isClient, setIsClient] = useState(false);
    const supabase = createClient();

    useEffect(() => {
        setIsClient(true);
    }, []);

    const calculateStreak = (checkins: CheckIn[]): number => {
        if (!isClient || checkins.length === 0) return 0;

        // Use string dates to avoid timezone issues
        const sortedCheckinDates = checkins
            .map(c => c.checked_on)
            .sort((a, b) => b.localeCompare(a)); // Sort newest first

        console.log('Calculating streak for checkin dates:', sortedCheckinDates);

        let streak = 0;
        let currentDate = new Date();
        
        // Check if user checked in today
        const today = new Date().toISOString().split('T')[0];
        const hasCheckedInToday = checkins.some(c => c.checked_on === today);
        
        // If they haven't checked in today, start counting from yesterday
        if (!hasCheckedInToday) {
            currentDate.setDate(currentDate.getDate() - 1);
        }

        console.log('Starting streak calculation from date:', currentDate.toISOString().split('T')[0], 'hasCheckedInToday:', hasCheckedInToday);

        for (const checkinDateStr of sortedCheckinDates) {
            const expectedDateStr = currentDate.toISOString().split('T')[0];
            
            console.log('Comparing checkin date:', checkinDateStr, 'with expected date:', expectedDateStr);
            
            if (checkinDateStr === expectedDateStr) {
                streak++;
                console.log('Match! Streak now:', streak);
                currentDate.setDate(currentDate.getDate() - 1);
            } else {
                // If we missed a day, break the streak
                console.log('No match, breaking streak at:', streak);
                break;
            }
        }

        console.log('Final streak:', streak);
        return streak;
    };

    const isCheckedInToday = (checkins: CheckIn[]): boolean => {
        if (!isClient) return false;
        const today = new Date().toISOString().split('T')[0];
        return checkins.some(c => c.checked_on === today);
    };

    const fetchGoals = async () => {
        try {
            setLoading(true);
            setError(null);

            console.log('Fetching goals...');
            
            const { data: { user }, error: authError } = await supabase.auth.getUser();
            console.log('User:', user, 'Auth error:', authError);
            
            if (authError) {
                throw new Error(`Auth error: ${authError.message}`);
            }
            
            if (!user) {
                setError('User not authenticated');
                return;
            }

            const { data, error } = await supabase
                .from('goals')
                .select('id, user_id, title, reasons, time1, time2, time3, created_at, updated_at, is_active')
                .eq('user_id', user.id)
                .eq('is_active', true)
                .order('created_at', { ascending: false });

            console.log('Goals data:', data, 'Goals error:', error);

            if (error) throw error;

            // Get checkins data for each goal
            const { data: checkinsData, error: checkinsError } = await supabase
                .from('checkins')
                .select('*')
                .eq('user_id', user.id);

            console.log('Checkins data:', checkinsData, 'Checkins error:', checkinsError);

            if (checkinsError) throw checkinsError;

            const goalsWithCheckins = (data || []).map((goal: Goal) => {
                const goalCheckins = (checkinsData || []).filter((c: CheckIn) => c.goal_id === goal.id);
                return {
                    ...goal,
                    checkin_count: goalCheckins.length,
                    currentStreak: calculateStreak(goalCheckins),
                    checkedInToday: isCheckedInToday(goalCheckins),
                };
            });

            console.log('Final goals with checkins:', goalsWithCheckins);
            setGoals(goalsWithCheckins);
        } catch (err) {
            console.error('Error in fetchGoals:', err);
            setError(err instanceof Error ? err.message : 'Failed to fetch goals');
        } finally {
            setLoading(false);
        }
    };

    const createGoal = async (title: string, reasons: string[] = [], times: { time1?: string; time2?: string; time3?: string } = {}) => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('User not authenticated');

            const goalData = { 
                user_id: user.id,
                title: title.trim(),
                reasons: reasons.length > 0 ? reasons : [],
                time1: times.time1 || null,
                time2: times.time2 || null,
                time3: times.time3 || null,
                is_active: true
            };

            console.log('Creating goal with data:', goalData);

            const { data, error } = await supabase
                .from('goals')
                .insert([goalData])
                .select();

            console.log('Create goal response - data:', data, 'error:', error);

            if (error) throw error;

            await fetchGoals();
        } catch (err) {
            console.error('Error creating goal:', err);
            setError(err instanceof Error ? err.message : 'Failed to create goal');
            throw err;
        }
    };

    const updateGoal = async (id: string, updates: { title?: string; reasons?: string[]; time1?: string | null; time2?: string | null; time3?: string | null }) => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('User not authenticated');

            console.log('Updating goal with id:', id, 'updates:', updates);

            const { data, error } = await supabase
                .from('goals')
                .update(updates)
                .eq('id', id)
                .eq('user_id', user.id)
                .select();

            console.log('Update goal response - data:', data, 'error:', error);

            if (error) throw error;

            await fetchGoals();
        } catch (err) {
            console.error('Error updating goal:', err);
            setError(err instanceof Error ? err.message : 'Failed to update goal');
            throw err;
        }
    };

    const deleteGoal = async (id: string) => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('User not authenticated');

            console.log('Deleting goal:', id, 'for user:', user.id);

            // Hard delete the goal - this will cascade delete all related checkins
            const { error } = await supabase
                .from('goals')
                .delete()
                .eq('id', id)
                .eq('user_id', user.id);

            console.log('Delete goal response error:', error);

            if (error) throw error;

            await fetchGoals();
        } catch (err) {
            console.error('Error deleting goal:', err);
            setError(err instanceof Error ? err.message : 'Failed to delete goal');
            throw err;
        }
    };

    const handleCheckIn = async (goalId: string) => {
        try {
            setCheckingIn(goalId);
            
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('User not authenticated');

            if (!isClient) {
                throw new Error('Client not ready');
            }

            const today = new Date().toISOString().split('T')[0];

            console.log('Checking in for goal:', goalId, 'on date:', today);

            const { error } = await supabase
                .from('checkins')
                .insert([{
                    user_id: user.id,
                    goal_id: goalId,
                    checked_on: today,
                }]);

            console.log('Check-in response error:', error);

            if (error) throw error;

            await fetchGoals();
        } catch (err) {
            console.error('Error checking in:', err);
            setError(err instanceof Error ? err.message : 'Failed to check in');
            throw err;
        } finally {
            setCheckingIn(null);
        }
    };

    useEffect(() => {
        if (isClient) {
            fetchGoals();
        }
    }, [isClient]);

    return {
        goals,
        loading,
        error,
        checkingIn,
        createGoal,
        updateGoal,
        deleteGoal,
        handleCheckIn,
        refetch: fetchGoals
    };
}