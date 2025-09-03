'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar,
  Clock,
  Users,
  Trophy,
  FileText,
  Plus,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { toast } from 'sonner';
import { apiRequest } from '@/lib/api';
import { formatDistanceToNow } from 'date-fns';

interface Event {
  id: number;
  name: string;
  description: string;
  status: string;
  startDate: string;
  endDate: string;
  tracks: string[];
}

interface Team {
  id: number;
  name: string;
  eventId: number;
}

interface Submission {
  _id: string;
  eventId: number;
  teamId: number;
  title: string;
  submittedAt: string;
  round: number;
}

interface EventSubmissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateSubmission: (eventId: number, teamId: number) => void;
}

export default function EventSubmissionModal({ 
  isOpen, 
  onClose, 
  onCreateSubmission 
}: EventSubmissionModalProps) {
  const [events, setEvents] = useState<Event[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchData();
    }
  }, [isOpen]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [eventsRes, teamsRes, submissionsRes] = await Promise.all([
        apiRequest<{ data: Event[] }>('/events'),
        apiRequest<{ data: Team[] }>('/teams/my-teams'),
        apiRequest<{ data: Submission[] }>('/submissions/my-submissions')
      ]);

      setEvents(eventsRes.data || []);
      setTeams(teamsRes.data || []);
      setSubmissions(submissionsRes.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const getEventStatus = (event: Event) => {
    switch (event.status) {
      case 'started':
        return { color: 'bg-green-100 text-green-800', label: 'Started - Submissions Open' };
      case 'upcoming':
        return { color: 'bg-yellow-100 text-yellow-800', label: 'Upcoming' };
      case 'ended':
        return { color: 'bg-gray-100 text-gray-800', label: 'Ended' };
      case 'active':
        return { color: 'bg-blue-100 text-blue-800', label: 'Active' };
      default:
        return { color: 'bg-gray-100 text-gray-800', label: event.status };
    }
  };

  const getTeamsForEvent = (eventId: number) => {
    return teams.filter(team => team.eventId === eventId);
  };

  const getSubmissionForTeam = (eventId: number, teamId: number) => {
    return submissions.find(sub => sub.eventId === eventId && sub.teamId === teamId);
  };

  const canSubmit = (event: Event) => {
    return event.status === 'started';
  };

  const handleSubmit = (eventId: number, teamId: number) => {
    onCreateSubmission(eventId, teamId);
    onClose();
  };

  if (loading) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Loading Events...</DialogTitle>
          </DialogHeader>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Select Event for Submission</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {events.length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="font-medium mb-2">No events available</h3>
              <p className="text-sm text-muted-foreground">
                There are no events available for submissions at the moment.
              </p>
            </div>
          ) : (
            events.map((event) => {
              const eventTeams = getTeamsForEvent(event.id);
              const statusInfo = getEventStatus(event);
              const submissionAllowed = canSubmit(event);

              return (
                <Card key={event.id} className={`${submissionAllowed ? 'border-green-200' : 'border-gray-200'}`}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{event.name}</CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">
                          {event.description}
                        </p>
                      </div>
                      <Badge className={statusInfo.color}>
                        {statusInfo.label}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {/* Event Details */}
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>
                          {new Date(event.startDate).toLocaleDateString()} - {new Date(event.endDate).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Trophy className="h-4 w-4" />
                        <span>{event.tracks?.length || 0} tracks</span>
                      </div>
                    </div>

                    {/* Submission Status Message */}
                    {!submissionAllowed && (
                      <div className="flex items-center gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg mb-4">
                        <AlertCircle className="h-4 w-4 text-yellow-600" />
                        <span className="text-sm text-yellow-800">
                          {event.status === 'upcoming' && 'Event has not started yet. Submissions will be available once the event begins.'}
                          {event.status === 'ended' && 'Event has ended. No more submissions are accepted.'}
                          {event.status === 'active' && 'Event is active but submissions are not yet open.'}
                          {!['upcoming', 'ended', 'active'].includes(event.status) && 'Submissions are not available for this event status.'}
                        </span>
                      </div>
                    )}

                    {/* Teams */}
                    {eventTeams.length === 0 ? (
                      <div className="text-center py-4 text-sm text-muted-foreground">
                        You are not part of any team for this event.
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <h4 className="font-medium text-sm">Your Teams:</h4>
                        {eventTeams.map((team) => {
                          const existingSubmission = getSubmissionForTeam(event.id, team.id);
                          
                          return (
                            <div key={team.id} className="flex items-center justify-between p-3 border rounded-lg">
                              <div className="flex items-center gap-2">
                                <Users className="h-4 w-4" />
                                <span className="font-medium">{team.name}</span>
                                {existingSubmission && (
                                  <div className="flex items-center gap-1 text-green-600">
                                    <CheckCircle className="h-4 w-4" />
                                    <span className="text-xs">
                                      Submitted {formatDistanceToNow(new Date(existingSubmission.submittedAt))} ago
                                    </span>
                                  </div>
                                )}
                              </div>
                              <div className="flex items-center gap-2">
                                {existingSubmission && (
                                  <Badge variant="outline" className="text-green-600 border-green-600">
                                    Round {existingSubmission.round}
                                  </Badge>
                                )}
                                <Button
                                  size="sm"
                                  disabled={!submissionAllowed}
                                  onClick={() => handleSubmit(event.id, team.id)}
                                  variant={existingSubmission ? "outline" : "default"}
                                >
                                  {existingSubmission ? (
                                    <>
                                      <FileText className="h-4 w-4 mr-1" />
                                      Update Submission
                                    </>
                                  ) : (
                                    <>
                                      <Plus className="h-4 w-4 mr-1" />
                                      New Submission
                                    </>
                                  )}
                                </Button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>

        <div className="flex justify-end pt-4">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
