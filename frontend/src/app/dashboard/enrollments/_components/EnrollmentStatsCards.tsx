import { 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  Users,
  Clock
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { EnrollmentStats } from '@/hooks/useEnrollments';

interface EnrollmentStatsCardsProps {
  stats: EnrollmentStats;
}

export const EnrollmentStatsCards = ({ stats }: EnrollmentStatsCardsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-blue-600" />
            <div>
              <p className="text-sm text-muted-foreground">Total Enrollments</p>
              <p className="text-2xl font-bold">{stats.totalEnrollments}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <div>
              <p className="text-sm text-muted-foreground">Active Enrollments</p>
              <p className="text-2xl font-bold">{stats.enrolledCount}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-orange-600" />
            <div>
              <p className="text-sm text-muted-foreground">Pending</p>
              <p className="text-2xl font-bold">{stats.pendingCount}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-yellow-600" />
            <div>
              <p className="text-sm text-muted-foreground">Waitlisted</p>
              <p className="text-2xl font-bold">{stats.waitlistCount}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-2">
            <XCircle className="h-5 w-5 text-red-600" />
            <div>
              <p className="text-sm text-muted-foreground">Cancelled</p>
              <p className="text-2xl font-bold">{stats.cancelledCount}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
