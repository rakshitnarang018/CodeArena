'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Edit, 
  Trash2, 
  Settings, 
  Users,
  AlertTriangle 
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { apiRequest } from '@/lib/api';
import { Event } from './types';
import { EventEditDialog } from './EventEditDialog';
import { EventDeleteDialog } from './EventDeleteDialog';

interface OrganizerSidebarProps {
  event: Event;
  formatDateTime: (dateString: string) => string;
  onEventUpdated: () => void;
}

export const OrganizerSidebar = ({ event, formatDateTime, onEventUpdated }: OrganizerSidebarProps) => {
  const { user } = useAuth();
  const router = useRouter();
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [enrollmentStats, setEnrollmentStats] = useState<{
    totalEnrollments: number;
    enrolledCount: number;
    pendingCount: number;
    waitlistCount: number;
  } | null>(null);

  // Check if current user is the organizer of this event
  const isEventOrganizer = user?.id === event.OrganizerID.toString();

  const fetchEnrollmentStats = async () => {
    try {
      const stats = await apiRequest(`/events/${event.EventID}/enrollment-stats`, {
        method: 'GET'
      });
      setEnrollmentStats((stats as any)?.data);
    } catch (error) {
      console.error('Error fetching enrollment stats:', error);
    }
  };

  useEffect(() => {
    fetchEnrollmentStats();
  }, [event.EventID]);

  const handleViewEnrollments = () => {
    router.push(`/dashboard/enrollments?eventId=${event.EventID}`);
  };

  const handleEditEvent = () => {
    setShowEditDialog(true);
  };

  const handleDeleteEvent = () => {
    setShowDeleteDialog(true);
  };

  const handleEventDeleted = () => {
    router.push('/dashboard/events');
  };

  if (!isEventOrganizer) {
    return null; // Don't show organizer sidebar if user is not the organizer
  }

  return (
    <div className="space-y-6">
      {/* Organizer Actions Card */}
      <Card className="card-optimized">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Event Management
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <Button 
              onClick={handleEditEvent}
              variant="outline" 
              className="w-full gap-2"
            >
              <Edit className="h-4 w-4" />
              Edit Event
            </Button>
            
            <Button 
              onClick={handleViewEnrollments}
              variant="outline" 
              className="w-full gap-2"
            >
              <Users className="h-4 w-4" />
              View Enrollments
            </Button>
            
            <Button 
              onClick={handleDeleteEvent}
              variant="destructive" 
              className="w-full gap-2"
            >
              <Trash2 className="h-4 w-4" />
              Delete Event
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Enrollment Statistics Card */}
      {enrollmentStats && (
        <Card className="card-optimized">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Enrollment Stats
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-primary">{enrollmentStats.totalEnrollments}</p>
                <p className="text-xs text-muted-foreground">Total</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">{enrollmentStats.enrolledCount}</p>
                <p className="text-xs text-muted-foreground">Enrolled</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-orange-600">{enrollmentStats.pendingCount}</p>
                <p className="text-xs text-muted-foreground">Pending</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-yellow-600">{enrollmentStats.waitlistCount}</p>
                <p className="text-xs text-muted-foreground">Waitlist</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Event Status Card */}
      <Card className="card-optimized">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Event Status
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm">Active Status:</span>
              <Badge variant={event.IsActive ? 'default' : 'secondary'}>
                {event.IsActive ? 'Active' : 'Inactive'}
              </Badge>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm">Registration:</span>
              <Badge variant="outline">
                Open
              </Badge>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm">Submissions:</span>
              <Badge variant="outline">
                {event.SubmissionDeadline && new Date() < new Date(event.SubmissionDeadline) ? 'Open' : 'Closed'}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Event Timing Card */}
      <Card className="card-optimized">
        <CardHeader>
          <CardTitle>Key Dates</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Start:</span>
              <span className="font-medium">{formatDateTime(event.StartDate)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">End:</span>
              <span className="font-medium">{formatDateTime(event.EndDate)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Submission:</span>
              <span className="font-medium">{event.SubmissionDeadline ? formatDateTime(event.SubmissionDeadline) : 'N/A'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Results:</span>
              <span className="font-medium">{event.ResultDate ? formatDateTime(event.ResultDate) : 'N/A'}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Edit Event Dialog */}
      <EventEditDialog
        event={event}
        isOpen={showEditDialog}
        onClose={() => setShowEditDialog(false)}
        onEventUpdated={() => {
          onEventUpdated();
          setShowEditDialog(false);
        }}
      />

      {/* Delete Event Dialog */}
      <EventDeleteDialog
        event={event}
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onEventDeleted={handleEventDeleted}
      />
    </div>
  );
};
