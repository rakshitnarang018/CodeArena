import { Calendar, Users } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { EnrollmentStats } from '@/hooks/useEnrollments';

interface EventBreakdownProps {
  stats: EnrollmentStats;
}

export const EventBreakdown = ({ stats }: EventBreakdownProps) => {
  if (!stats.eventBreakdown.length) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Enrollment Breakdown by Event</CardTitle>
        <CardDescription>
          Number of active enrollments per event
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {stats.eventBreakdown.map((event) => (
            <div key={event.EventID} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">{event.EventName}</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span className="font-semibold">{event.enrollmentCount}</span>
                <span className="text-sm text-muted-foreground">participants</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
