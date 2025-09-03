'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { eventsAPI } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  Trophy, 
  FileText,
  MessageCircle,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import EventChatQna from './_components';

interface EventDetail {
  EventID: number;
  Name: string;
  Description: string;
  Theme: string;
  Mode: 'Online' | 'Offline' | 'Hybrid';
  StartDate: string;
  EndDate: string;
  SubmissionDeadline: string;
  ResultDate: string;
  Rules: string;
  Timeline: string;
  Tracks: string;
  Prizes: string;
  MaxTeamSize: number;
  Sponsors: string;
  OrganizerID: number;
  Status: 'Draft' | 'Published' | 'Ongoing' | 'Completed' | 'Cancelled';
  CreatedAt: string;
  UpdatedAt: string;
  organizerDetails?: {
    name: string;
    email: string;
  };
  enrollmentStatus?: 'enrolled' | 'not_enrolled' | 'pending';
  enrollmentCount?: number;
  isUserOrganizer?: boolean;
}

const EventDetailPage = () => {
  const params = useParams();
  const { user } = useAuth();
  const [event, setEvent] = useState<EventDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const eventId = params.id as string;

  useEffect(() => {
    const fetchEventDetails = async () => {
      if (!eventId) return;

      setLoading(true);
      setError(null);

      try {
        const response = await eventsAPI.getById(eventId) as { success: boolean; data: EventDetail; message: string };
        
        if (response.success) {
          setEvent(response.data);
        } else {
          setError(response.message || 'Failed to fetch event details');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch event details');
      } finally {
        setLoading(false);
      }
    };

    fetchEventDetails();
  }, [eventId]);

  const handleEnrollment = async () => {
    if (!event) return;

    try {
      if (event.enrollmentStatus === 'enrolled') {
        await eventsAPI.unregister(eventId);
        setEvent(prev => prev ? { ...prev, enrollmentStatus: 'not_enrolled' } : null);
        toast.success('Successfully unenrolled from event');
      } else {
        await eventsAPI.register(eventId);
        setEvent(prev => prev ? { ...prev, enrollmentStatus: 'enrolled' } : null);
        toast.success('Successfully enrolled in event');
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Enrollment action failed');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading event details...</p>
        </div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-4" />
          <p className="text-muted-foreground">{error || 'Event not found'}</p>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'published': return 'bg-green-100 text-green-800';
      case 'ongoing': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-yellow-100 text-yellow-800';
    }
  };

  const getModeIcon = (mode: string) => {
    switch (mode?.toLowerCase()) {
      case 'online': return '🌐';
      case 'offline': return '📍';
      case 'hybrid': return '🔄';
      default: return '📍';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Event Header */}
      <div className="mb-8">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h1 className="text-3xl font-bold mb-2">{event.Name}</h1>
            <p className="text-lg text-muted-foreground mb-4">{event.Description}</p>
            
            <div className="flex flex-wrap gap-4 mb-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">
                  {format(new Date(event.StartDate), 'MMM dd, yyyy')} - {format(new Date(event.EndDate), 'MMM dd, yyyy')}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{getModeIcon(event.Mode)} {event.Mode}</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Max {event.MaxTeamSize} members per team</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">
                  Deadline: {format(new Date(event.SubmissionDeadline), 'MMM dd, yyyy')}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Badge className={getStatusColor(event.Status)}>
                {event.Status}
              </Badge>
              <Badge variant="secondary">
                {event.Theme}
              </Badge>
            </div>
          </div>

          {!event.isUserOrganizer && user && (
            <div className="ml-4">
              <Button 
                onClick={handleEnrollment}
                variant={event.enrollmentStatus === 'enrolled' ? 'outline' : 'default'}
                size="lg"
              >
                {event.enrollmentStatus === 'enrolled' ? 'Unenroll' : 'Enroll Now'}
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="rules">Rules</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
          <TabsTrigger value="prizes">Prizes</TabsTrigger>
          <TabsTrigger value="faq">FAQ</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Event Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Theme</h4>
                  <p className="text-sm text-muted-foreground">{event.Theme}</p>
                </div>
                <Separator />
                <div>
                  <h4 className="font-medium mb-2">Tracks</h4>
                  <p className="text-sm text-muted-foreground">{event.Tracks}</p>
                </div>
                <Separator />
                <div>
                  <h4 className="font-medium mb-2">Organizer</h4>
                  <p className="text-sm text-muted-foreground">
                    {event.organizerDetails?.name || 'Event Organizer'}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5" />
                  Quick Stats
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-sm">Enrollments</span>
                  <span className="font-medium">{event.enrollmentCount || 0}</span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-sm">Max Team Size</span>
                  <span className="font-medium">{event.MaxTeamSize}</span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-sm">Status</span>
                  <Badge className={getStatusColor(event.Status)} variant="secondary">
                    {event.Status}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="rules">
          <Card>
            <CardHeader>
              <CardTitle>Rules & Guidelines</CardTitle>
              <CardDescription>
                Please read and follow these rules carefully
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="prose max-w-none">
                <pre className="whitespace-pre-wrap text-sm">{event.Rules}</pre>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="timeline">
          <Card>
            <CardHeader>
              <CardTitle>Event Timeline</CardTitle>
              <CardDescription>
                Important dates and milestones
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="prose max-w-none">
                <pre className="whitespace-pre-wrap text-sm">{event.Timeline}</pre>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="prizes">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5" />
                Prizes & Rewards
              </CardTitle>
              <CardDescription>
                What you can win
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="prose max-w-none">
                <pre className="whitespace-pre-wrap text-sm">{event.Prizes}</pre>
              </div>
              
              {event.Sponsors && (
                <div className="mt-6">
                  <h4 className="font-medium mb-3">Sponsored by</h4>
                  <p className="text-sm text-muted-foreground">{event.Sponsors}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="faq">
          <EventChatQna eventId={eventId} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EventDetailPage;
