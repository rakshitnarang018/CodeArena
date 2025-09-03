'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useEvent } from '@/hooks/useEvents';
import { useAuth } from '@/contexts/AuthContext';
import { apiRequest } from '@/lib/api';
import { 
  EventHeader,
  EventHeroCard,
  EventOverview,
  EventTimeline,
  EventRules,
  EventTracks,
  EventPrizes,
  EventSidebar,
  OrganizerSidebar,
  LoadingState,
  NotFoundState,
  EventQnA,
  type Event
} from './_components';

const EventDetailPage = () => {
  const { user } = useAuth();
  const params = useParams();
  const router = useRouter();
  const eventId = params?.eventId as string;
  
  // Use the regular event hook
  const { event, loading, error, refetch } = useEvent(eventId);
  const [userTeam, setUserTeam] = useState<any>(null);
  const [isRegistered, setIsRegistered] = useState(false);
  const [teamsLoading, setTeamsLoading] = useState(false);

  // Fetch user's teams to check if enrolled in this event
  useEffect(() => {
    const fetchUserTeams = async () => {
      if (!user?.id || !eventId) return;
      
      setTeamsLoading(true);
      try {
        const response = await apiRequest<{ data: any[] }>('/teams/my-teams');
        const eventTeam = response.data?.find(team => team.EventId.toString() === eventId);
        
        if (eventTeam) {
          setUserTeam(eventTeam);
          setIsRegistered(true);
        } else {
          setUserTeam(null);
          setIsRegistered(false);
        }
      } catch (error) {
        console.error('Error fetching user teams:', error);
        setUserTeam(null);
        setIsRegistered(false);
      } finally {
        setTeamsLoading(false);
      }
    };

    fetchUserTeams();
  }, [user?.id, eventId]);

  // Check if current user is the organizer
  const isEventOrganizer = user?.id === event?.OrganizerID?.toString();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getEventStatus = () => {
    if (!event) return { status: 'unknown', color: 'gray', text: 'Unknown' };
    
    const now = new Date();
    const start = new Date(event.StartDate);
    const end = new Date(event.EndDate);
    const submission = event.SubmissionDeadline ? new Date(event.SubmissionDeadline) : end;

    if (now < start) return { status: 'upcoming', color: 'blue', text: 'Registration Open' };
    if (now >= start && now <= end) return { status: 'live', color: 'green', text: 'Live Now' };
    if (now > end && now <= submission) return { status: 'submission', color: 'orange', text: 'Submission Phase' };
    return { status: 'ended', color: 'gray', text: 'Event Ended' };
  };

  const handleRegister = () => {
    setIsRegistered(true);
    // Refetch teams to get updated data
    const fetchUserTeams = async () => {
      if (!user?.id || !eventId) return;
      
      try {
        const response = await apiRequest<{ data: any[] }>('/teams/my-teams');
        const eventTeam = response.data?.find(team => team.EventId.toString() === eventId);
        
        if (eventTeam) {
          setUserTeam(eventTeam);
          setIsRegistered(true);
        }
      } catch (error) {
        console.error('Error fetching user teams:', error);
      }
    };
    
    fetchUserTeams();
  };

  const formatList = (text: string) => {
    return text.split('\n').filter(line => line.trim()).map((line, index) => (
      <div key={index} className="mb-2">
        {line.trim()}
      </div>
    ));
  };

  if (loading) {
    return <LoadingState />;
  }

  if (error || !event) {
    return <NotFoundState onBack={() => router.back()} />;
  }

  const eventStatus = getEventStatus();

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <EventHeader 
        eventStatus={eventStatus} 
        onBack={() => router.back()} 
      />

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <EventHeroCard event={event} />

          {/* Event Details Tabs */}
          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="rules">Rules</TabsTrigger>
              <TabsTrigger value="timeline">Timeline</TabsTrigger>
              <TabsTrigger value="tracks">Tracks</TabsTrigger>
              <TabsTrigger value="prizes">Prizes</TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <EventOverview 
                event={event} 
                formatDate={formatDate}
                formatList={formatList}
              />
            </TabsContent>

            <TabsContent value="rules">
              <EventRules 
                event={event} 
                formatList={formatList}
              />
            </TabsContent>

            <TabsContent value="timeline">
              <EventTimeline 
                event={event} 
                formatDateTime={formatDateTime}
                formatList={formatList}
              />
            </TabsContent>

            <TabsContent value="tracks">
              <EventTracks 
                event={event} 
                formatList={formatList}
              />
            </TabsContent>

            <TabsContent value="prizes">
              <EventPrizes 
                event={event} 
                formatList={formatList}
              />
            </TabsContent>
          </Tabs>

          {/* Event Q&A Section */}
          <EventQnA 
            eventId={eventId}
            isOrganizer={isEventOrganizer}
          />
        </div>

        {/* Right Column - Sidebar */}
        <div className="lg:col-span-1">
          {isEventOrganizer ? (
            <OrganizerSidebar 
              event={event}
              formatDateTime={formatDateTime}
              onEventUpdated={refetch}
            />
          ) : (
            <EventSidebar 
              event={event}
              isRegistered={isRegistered}
              userTeam={userTeam}
              teamsLoading={teamsLoading}
              onRegister={handleRegister}
              formatDateTime={formatDateTime}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default EventDetailPage;

         