import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { X, Plus, Edit3, Check } from 'lucide-react';
import { GoalWithCheckins } from '../types';

interface EditGoalDialogProps {
    goal: GoalWithCheckins | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSave: (id: string, updates: { title?: string; reasons?: string[]; time1?: string | null; time2?: string | null; time3?: string | null }) => Promise<void>;
}

export function EditGoalDialog({ goal, open, onOpenChange, onSave }: EditGoalDialogProps) {
    const [title, setTitle] = useState('');
    const [reasons, setReasons] = useState<string[]>([]);
    const [newReason, setNewReason] = useState('');
    const [time1, setTime1] = useState('');
    const [time2, setTime2] = useState('');
    const [time3, setTime3] = useState('');
    const [loading, setLoading] = useState(false);
    const [editingReasonIndex, setEditingReasonIndex] = useState<number | null>(null);
    const [editingReasonText, setEditingReasonText] = useState('');

    React.useEffect(() => {
        if (goal) {
            setTitle(goal.title);
            setReasons(goal.reasons || []);
            setTime1(goal.time1 || '');
            setTime2(goal.time2 || '');
            setTime3(goal.time3 || '');
        }
    }, [goal]);

    const addReason = () => {
        if (newReason.trim() && !reasons.includes(newReason.trim())) {
            setReasons([...reasons, newReason.trim()]);
            setNewReason('');
        }
    };

    const removeReason = (reasonToRemove: string) => {
        setReasons(reasons.filter(reason => reason !== reasonToRemove));
    };

    const startEditingReason = (index: number) => {
        setEditingReasonIndex(index);
        setEditingReasonText(reasons[index]);
    };

    const saveEditingReason = () => {
        if (editingReasonIndex !== null && editingReasonText.trim()) {
            const updatedReasons = [...reasons];
            updatedReasons[editingReasonIndex] = editingReasonText.trim();
            setReasons(updatedReasons);
        }
        setEditingReasonIndex(null);
        setEditingReasonText('');
    };

    const cancelEditingReason = () => {
        setEditingReasonIndex(null);
        setEditingReasonText('');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!goal || !title.trim()) return;

        try {
            setLoading(true);
            await onSave(goal.id, { 
                title: title.trim(), 
                reasons,
                time1: time1 || null,
                time2: time2 || null,
                time3: time3 || null
            });
            onOpenChange(false);
        } catch (error) {
            console.error('Failed to update goal:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            addReason();
        }
    };

    const handleEditKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            saveEditingReason();
        } else if (e.key === 'Escape') {
            e.preventDefault();
            cancelEditingReason();
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[525px]">
                <DialogHeader>
                    <DialogTitle>Edit Goal</DialogTitle>
                    <DialogDescription>
                        Update your goal title and reasons.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="title" className="text-right">
                                Title
                            </Label>
                            <Input
                                id="title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="col-span-3"
                                required
                            />
                        </div>
                        
                        <div className="grid grid-cols-4 items-start gap-4">
                            <Label className="text-right pt-2">
                                Reasons
                            </Label>
                            <div className="col-span-3 space-y-2">
                                <div className="flex gap-2">
                                    <Input
                                        value={newReason}
                                        onChange={(e) => setNewReason(e.target.value)}
                                        placeholder="Add a reason..."
                                        onKeyPress={handleKeyPress}
                                        className="flex-1"
                                    />
                                    <Button
                                        type="button"
                                        onClick={addReason}
                                        size="sm"
                                        disabled={!newReason.trim()}
                                    >
                                        <Plus className="h-4 w-4" />
                                    </Button>
                                </div>
                                
                                <div className="flex flex-wrap gap-2">
                                    {reasons.map((reason, index) => (
                                        <div key={index} className="flex items-center">
                                            {editingReasonIndex === index ? (
                                                <div className="flex items-center gap-1">
                                                    <Input
                                                        value={editingReasonText}
                                                        onChange={(e) => setEditingReasonText(e.target.value)}
                                                        onKeyPress={handleEditKeyPress}
                                                        className="h-6 text-xs px-2 min-w-[100px]"
                                                        autoFocus
                                                    />
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="sm"
                                                        className="h-6 w-6 p-0"
                                                        onClick={saveEditingReason}
                                                    >
                                                        <Check className="h-3 w-3 text-green-600" />
                                                    </Button>
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="sm"
                                                        className="h-6 w-6 p-0"
                                                        onClick={cancelEditingReason}
                                                    >
                                                        <X className="h-3 w-3 text-red-600" />
                                                    </Button>
                                                </div>
                                            ) : (
                                                <Badge variant="secondary" className="gap-1">
                                                    <span onClick={() => startEditingReason(index)} className="cursor-pointer">
                                                        {reason}
                                                    </span>
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="sm"
                                                        className="h-auto p-0 text-muted-foreground hover:text-foreground"
                                                        onClick={() => startEditingReason(index)}
                                                        title="Edit reason"
                                                    >
                                                        <Edit3 className="h-3 w-3" />
                                                    </Button>
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="sm"
                                                        className="h-auto p-0 text-muted-foreground hover:text-foreground"
                                                        onClick={() => removeReason(reason)}
                                                        title="Remove reason"
                                                    >
                                                        <X className="h-3 w-3" />
                                                    </Button>
                                                </Badge>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                        
                        <div className="grid grid-cols-4 items-start gap-4">
                            <Label className="text-right pt-2">
                                Times
                            </Label>
                            <div className="col-span-3 space-y-2">
                                <div className="grid grid-cols-3 gap-2">
                                    <div>
                                        <Label htmlFor="edit-time1" className="text-xs text-muted-foreground">Time 1</Label>
                                        <Input
                                            id="edit-time1"
                                            type="time"
                                            value={time1}
                                            onChange={(e) => setTime1(e.target.value)}
                                            className="text-sm"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="edit-time2" className="text-xs text-muted-foreground">Time 2</Label>
                                        <Input
                                            id="edit-time2"
                                            type="time"
                                            value={time2}
                                            onChange={(e) => setTime2(e.target.value)}
                                            className="text-sm"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="edit-time3" className="text-xs text-muted-foreground">Time 3</Label>
                                        <Input
                                            id="edit-time3"
                                            type="time"
                                            value={time3}
                                            onChange={(e) => setTime3(e.target.value)}
                                            className="text-sm"
                                        />
                                    </div>
                                </div>
                                <p className="text-xs text-muted-foreground">Optional: Set up to 3 times per day for this goal</p>
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="submit" disabled={loading || !title.trim()}>
                            {loading ? 'Saving...' : 'Save Changes'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}