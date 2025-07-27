import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';
import { GoalWithCheckins } from '../types';

interface DeleteConfirmationDialogProps {
    goal: GoalWithCheckins | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onConfirm: (goalId: string) => void;
    loading?: boolean;
}

export function DeleteConfirmationDialog({ 
    goal, 
    open, 
    onOpenChange, 
    onConfirm, 
    loading = false 
}: DeleteConfirmationDialogProps) {
    const handleConfirm = () => {
        if (goal) {
            onConfirm(goal.id);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
                            <AlertTriangle className="h-5 w-5 text-red-600" />
                        </div>
                        <div>
                            <DialogTitle className="text-left">Delete Goal</DialogTitle>
                            <DialogDescription className="text-left">
                                This action cannot be undone.
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>
                
                <div className="py-4">
                    <p className="text-sm text-muted-foreground mb-4">
                        Are you sure you want to delete the goal <span className="font-medium text-foreground">"{goal?.title}"</span>?
                    </p>
                    
                    <div className="bg-red-50 border border-red-200 rounded-md p-3">
                        <div className="flex">
                            <AlertTriangle className="h-4 w-4 text-red-600 mr-2 mt-0.5 flex-shrink-0" />
                            <div className="text-sm">
                                <p className="font-medium text-red-800 mb-1">This will permanently:</p>
                                <ul className="text-red-700 space-y-1">
                                    <li>• Delete the goal and all its data</li>
                                    <li>• Remove all check-in history ({goal?.checkin_count || 0} check-ins)</li>
                                    <li>• Reset your {goal?.currentStreak || 0} day streak</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                <DialogFooter className="gap-2 sm:gap-2">
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        disabled={loading}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={handleConfirm}
                        disabled={loading}
                    >
                        {loading ? 'Deleting...' : 'Delete Goal'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}