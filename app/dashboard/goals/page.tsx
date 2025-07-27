'use client';

import React from 'react';
import { useAuthGuard } from '@/hooks/useAuthGuard';
import LoadingSpinner from '@/components/ui/loading-spinner';
import { useGoals } from './hooks/useGoals';
import { GoalCard } from './components/GoalCard';
import { AddGoalDialog } from './components/AddGoalDialog';
import { EditGoalDialog } from './components/EditGoalDialog';
import { DeleteConfirmationDialog } from './components/DeleteConfirmationDialog';
import { toast } from 'sonner';
import { GoalWithCheckins } from './types';

export default function GoalsPage() {
    const { isLoadingUser } = useAuthGuard();
    const { goals, loading, error, checkingIn, createGoal, updateGoal, deleteGoal, handleCheckIn } = useGoals();
    const [editingGoal, setEditingGoal] = React.useState<GoalWithCheckins | null>(null);
    const [editDialogOpen, setEditDialogOpen] = React.useState(false);
    const [deletingGoal, setDeletingGoal] = React.useState<GoalWithCheckins | null>(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
    const [deleting, setDeleting] = React.useState(false);

    if (isLoadingUser) {
        return <LoadingSpinner fullscreen text="Loading goals..." />;
    }

    const handleAddGoal = async (title: string, reasons: string[], times: { time1?: string; time2?: string; time3?: string }) => {
        try {
            console.log('GoalsPage: handleAddGoal called with title:', title, 'reasons:', reasons, 'times:', times);
            await createGoal(title, reasons, times);
            toast.success('Goal created successfully!');
        } catch (error) {
            console.error('GoalsPage: Error in handleAddGoal:', error);
            toast.error('Failed to create goal');
        }
    };

    const handleEditGoal = (goal: GoalWithCheckins) => {
        setEditingGoal(goal);
        setEditDialogOpen(true);
    };

    const handleSaveGoal = async (id: string, updates: { title?: string; reasons?: string[] }) => {
        try {
            await updateGoal(id, updates);
            toast.success('Goal updated successfully!');
        } catch (error) {
            toast.error('Failed to update goal');
        }
    };

    const handleDeleteGoal = (goal: GoalWithCheckins) => {
        setDeletingGoal(goal);
        setDeleteDialogOpen(true);
    };

    const confirmDeleteGoal = async (goalId: string) => {
        try {
            setDeleting(true);
            await deleteGoal(goalId);
            toast.success('Goal deleted successfully!');
            setDeleteDialogOpen(false);
            setDeletingGoal(null);
        } catch (error) {
            toast.error('Failed to delete goal');
        } finally {
            setDeleting(false);
        }
    };

    const handleGoalCheckIn = async (goalId: string) => {
        try {
            await handleCheckIn(goalId);
            toast.success('Checked in successfully! Keep up the streak! 🔥');
        } catch (error) {
            toast.error('Failed to check in');
        }
    };

    if (loading) {
        return <LoadingSpinner fullscreen text="Loading goals..." />;
    }

    if (error) {
        return (
            <div className="flex flex-col w-full gap-6">
                <h1 className="text-2xl font-bold">Goals</h1>
                <div className="p-6 border rounded-md bg-destructive/10 text-destructive">
                    <p>Error loading goals: {error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col w-full gap-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">Goals</h1>
                <AddGoalDialog onAddGoal={handleAddGoal} />
            </div>

            {goals.length === 0 ? (
                <div className="p-6 border rounded-md bg-card text-card-foreground">
                    <p className="text-muted-foreground text-center">
                        No goals yet. Create your first goal to get started!
                    </p>
                </div>
            ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {goals.map((goal) => (
                        <GoalCard
                            key={goal.id}
                            goal={goal}
                            onDelete={handleDeleteGoal}
                            onEdit={handleEditGoal}
                            onCheckIn={handleGoalCheckIn}
                            checkingIn={checkingIn}
                        />
                    ))}
                </div>
            )}

            <EditGoalDialog
                goal={editingGoal}
                open={editDialogOpen}
                onOpenChange={setEditDialogOpen}
                onSave={handleSaveGoal}
            />

            <DeleteConfirmationDialog
                goal={deletingGoal}
                open={deleteDialogOpen}
                onOpenChange={setDeleteDialogOpen}
                onConfirm={confirmDeleteGoal}
                loading={deleting}
            />
        </div>
    );
}