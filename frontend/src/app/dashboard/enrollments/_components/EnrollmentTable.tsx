import { 
  Clock, 
  User, 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  MoreHorizontal,
  MessageSquare,
  Eye,
  Users
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Enrollment } from '@/hooks/useEnrollments';
import { format } from 'date-fns';

interface EnrollmentTableProps {
  enrollments: Enrollment[];
  onContactParticipant: (enrollment: Enrollment) => void;
  onViewProfile: (userId: number) => void;
}

export const EnrollmentTable = ({ 
  enrollments, 
  onContactParticipant, 
  onViewProfile 
}: EnrollmentTableProps) => {
  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'Enrolled':
        return 'bg-green-100 text-green-800';
      case 'Cancelled':
        return 'bg-red-100 text-red-800';
      case 'Waitlisted':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Enrolled':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'Cancelled':
        return <XCircle className="h-4 w-4 text-red-600" />;
      case 'Waitlisted':
        return <AlertCircle className="h-4 w-4 text-yellow-600" />;
      default:
        return null;
    }
  };

  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Participant</TableHead>
              <TableHead>Event</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Team</TableHead>
              <TableHead>Enrolled Date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {enrollments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  <div className="flex flex-col items-center gap-2">
                    <Users className="h-8 w-8 text-muted-foreground opacity-50" />
                    <p className="text-muted-foreground">No enrollments found</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              enrollments.map((enrollment) => (
                <TableRow key={enrollment.EnrollmentID}>
                  <TableCell>
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{enrollment.name || enrollment.UserName}</span>
                      </div>
                      <span className="text-sm text-muted-foreground">{enrollment.email || enrollment.UserEmail}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium">{enrollment.EventName || 'Event'}</span>
                      {enrollment.EventStartDate && (
                        <span className="text-sm text-muted-foreground">
                          {format(new Date(enrollment.EventStartDate), 'MMM dd, yyyy')}
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(enrollment.Status)}
                      <Badge variant="outline" className={getStatusBadgeColor(enrollment.Status)}>
                        {enrollment.Status}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    {enrollment.TeamName ? (
                      <span className="text-sm">{enrollment.TeamName}</span>
                    ) : (
                      <span className="text-sm text-muted-foreground">Individual</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Clock className="h-3 w-3 text-muted-foreground" />
                      <span className="text-sm">
                        {enrollment.EnrollmentDate ? (
                          format(new Date(enrollment.EnrollmentDate), 'MMM dd, yyyy HH:mm')
                        ) : (
                          'N/A'
                        )}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onContactParticipant(enrollment)}>
                          <MessageSquare className="h-4 w-4 mr-2" />
                          Contact Participant
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onViewProfile(enrollment.userid || enrollment.UserID)}>
                          <Eye className="h-4 w-4 mr-2" />
                          View Profile
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
