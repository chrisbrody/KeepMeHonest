import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trash2, Edit3 } from 'lucide-react';
import { GoalWithCheckins } from '../types';
import { format } from 'date-fns';

interface GoalCardProps {
    goal: GoalWithCheckins;
    onDelete: (goal: GoalWithCheckins) => void;
    onEdit: (goal: GoalWithCheckins) => void;
    onCheckIn: (goalId: string) => void;
    checkingIn: string | null;
}

export function GoalCard({ goal, onDelete, onEdit, onCheckIn, checkingIn }: GoalCardProps) {
    return (
        <Card className="w-full">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-lg font-medium">{goal.title}</CardTitle>
                <div className="flex gap-1">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEdit(goal)}
                        className="text-blue-500 hover:text-blue-700"
                    >
                        <Edit3 className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDelete(goal)}
                        className="text-red-500 hover:text-red-700"
                        title="Delete goal"
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
            </CardHeader>
            <CardContent className="space-y-3">
                {goal.reasons && goal.reasons.length > 0 && (
                    <div>
                        <p className="text-sm font-medium text-muted-foreground mb-1">Why:</p>
                        <div className="flex flex-wrap gap-1">
                            {goal.reasons.map((reason, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                    {reason}
                                </Badge>
                            ))}
                        </div>
                    </div>
                )}

                {(goal.time1 || goal.time2 || goal.time3) && (
                    <div>
                        <p className="text-sm font-medium text-muted-foreground mb-1">Times:</p>
                        <div className="flex flex-wrap gap-1">
                            {goal.time1 && (
                                <Badge variant="outline" className="text-xs">
                                    {goal.time1.slice(0, 5)} {/* Display HH:MM format */}
                                </Badge>
                            )}
                            {goal.time2 && (
                                <Badge variant="outline" className="text-xs">
                                    {goal.time2.slice(0, 5)}
                                </Badge>
                            )}
                            {goal.time3 && (
                                <Badge variant="outline" className="text-xs">
                                    {goal.time3.slice(0, 5)}
                                </Badge>
                            )}
                        </div>
                    </div>
                )}
                
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-sm">
                        <span className="text-muted-foreground">
                            🔥 {goal.currentStreak || 0} day streak
                        </span>
                        {goal.checkedInToday && (
                            <span className="text-green-600">✅ Checked in today</span>
                        )}
                    </div>
                </div>

                <div className="flex items-center justify-between">
                    <div className="text-sm text-muted-foreground">
                        Created: {format(new Date(goal.created_at), 'MMM d, yyyy')}
                    </div>
                    <Badge variant="secondary">
                        {goal.checkin_count || 0} check-ins
                    </Badge>
                </div>

                <div className="pt-2">
                    <Button
                        onClick={() => onCheckIn(goal.id)}
                        disabled={goal.checkedInToday || checkingIn === goal.id}
                        variant={goal.checkedInToday ? "secondary" : "default"}
                        className="w-full"
                    >
                        {checkingIn === goal.id ? 'Checking in...' : 
                         goal.checkedInToday ? 'Done for today' : 'Check in'}
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}