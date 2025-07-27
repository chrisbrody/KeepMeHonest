import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Plus, X, Edit3, Check } from 'lucide-react';

interface AddGoalDialogProps {
    onAddGoal: (title: string, reasons: string[], times: { time1?: string; time2?: string; time3?: string }) => Promise<void>;
}

export function AddGoalDialog({ onAddGoal }: AddGoalDialogProps) {
    const [open, setOpen] = useState(false);
    const [title, setTitle] = useState('');
    const [reasons, setReasons] = useState<string[]>([]);
    const [newReason, setNewReason] = useState('');
    const [time1, setTime1] = useState('');
    const [time2, setTime2] = useState('');
    const [time3, setTime3] = useState('');
    const [loading, setLoading] = useState(false);
    const [editingReasonIndex, setEditingReasonIndex] = useState<number | null>(null);
    const [editingReasonText, setEditingReasonText] = useState('');

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
        if (!title.trim()) return;

        try {
            setLoading(true);
            const times = {
                time1: time1 || undefined,
                time2: time2 || undefined,
                time3: time3 || undefined
            };
            console.log('AddGoalDialog: Submitting goal with title:', title.trim(), 'reasons:', reasons, 'times:', times);
            await onAddGoal(title.trim(), reasons, times);
            setTitle('');
            setReasons([]);
            setNewReason('');
            setTime1('');
            setTime2('');
            setTime3('');
            setOpen(false);
        } catch (error) {
            console.error('Failed to add goal:', error);
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
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Goal
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Add New Goal</DialogTitle>
                    <DialogDescription>
                        Create a new goal to track your progress.
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
                                placeholder="Enter goal title"
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
                                        <Label htmlFor="time1" className="text-xs text-muted-foreground">Time 1</Label>
                                        <Input
                                            id="time1"
                                            type="time"
                                            value={time1}
                                            onChange={(e) => setTime1(e.target.value)}
                                            className="text-sm"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="time2" className="text-xs text-muted-foreground">Time 2</Label>
                                        <Input
                                            id="time2"
                                            type="time"
                                            value={time2}
                                            onChange={(e) => setTime2(e.target.value)}
                                            className="text-sm"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="time3" className="text-xs text-muted-foreground">Time 3</Label>
                                        <Input
                                            id="time3"
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
                            {loading ? 'Adding...' : 'Add Goal'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}