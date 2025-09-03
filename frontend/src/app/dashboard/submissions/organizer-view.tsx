'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  FileText,
  Github,
  Video,
  ExternalLink,
  Eye,
  Users,
  Clock,
  Trophy,
  Star,
  Award,
  CheckCircle,
  AlertCircle,
  Edit,
  MessageSquare
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { apiRequest } from '@/lib/api';
import { formatDistanceToNow } from 'date-fns';
import { LoadingState, JudgingDialog } from './_components';

interface Submission {
  _id: string;
  eventId: number;
  teamId: number;
  title: string;
  description: string;
  track: string;
  githubUrl?: string;
  videoUrl?: string;
  docs: string[];
  round: number;
  submittedAt: string;
  updatedAt: string;
  eventName?: string;
  teamName?: string;
  // Judging fields
  judgingStatus: 'pending' | 'in-review' | 'judged';
  judgeId?: number;
  judgeName?: string;
  scores?: {
    innovation?: number;
    technical?: number;
    presentation?: number;
    impact?: number;
    overall?: number;
  };
  totalScore?: number;
  judgeComments?: string;
  rank?: number;
  isWinner: boolean;
  prize?: string;
  judgedAt?: string;
}

interface Event {
  id: number;
  name: string;
  status: string;
}

export default function OrganizerSubmissionsPage() {
  const { user } = useAuth();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEvent, setSelectedEvent] = useState<string>('all');
  const [selectedTrack, setSelectedTrack] = useState<string>('all');
  const [selectedJudgingStatus, setSelectedJudgingStatus] = useState<string>('all');
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [isJudgingDialogOpen, setIsJudgingDialogOpen] = useState(false);

  useEffect(() => {
    if (user?.role === 'organizer' || user?.role === 'judge') {
      fetchAllSubmissions();
      fetchEvents();
    }
  }, [user]);

  const fetchAllSubmissions = async () => {
    try {
      setLoading(true);
      const response = await apiRequest<{ data: Submission[] }>('/submissions');
      setSubmissions(response.data || []);
    } catch (error) {
      console.error('Error fetching submissions:', error);
      toast.error('Failed to fetch submissions');
    } finally {
      setLoading(false);
    }
  };

  const fetchEvents = async () => {
    try {
      const response = await apiRequest<{ data: Event[] }>('/events');
      setEvents(response.data || []);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  const filteredSubmissions = submissions.filter(submission => {
    if (!submission) return false;
    
    const matchesSearch = 
      (submission.title?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (submission.description?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (submission.teamName?.toLowerCase() || '').includes(searchTerm.toLowerCase());
    
    const matchesEvent = selectedEvent === 'all' || (submission.eventId && submission.eventId.toString() === selectedEvent);
    const matchesTrack = selectedTrack === 'all' || submission.track === selectedTrack;
    const matchesJudgingStatus = selectedJudgingStatus === 'all' || submission.judgingStatus === selectedJudgingStatus;

    return matchesSearch && matchesEvent && matchesTrack && matchesJudgingStatus;
  });

  const handleJudgeSubmission = (submission: Submission) => {
    setSelectedSubmission(submission);
    setIsJudgingDialogOpen(true);
  };

  const handleJudgingUpdate = () => {
    fetchAllSubmissions(); // Refresh the submissions list
  };

  const tracks = Array.from(new Set(submissions.map(s => s && s.track).filter(Boolean)));

  const getSubmissionStats = () => {
    const total = filteredSubmissions.length;
    const submitted = filteredSubmissions.filter(s => s.submittedAt).length;
    const pending = filteredSubmissions.filter(s => s.judgingStatus === 'pending').length;
    const judged = filteredSubmissions.filter(s => s.judgingStatus === 'judged').length;
    const winners = filteredSubmissions.filter(s => s.isWinner).length;
    const byEvent = filteredSubmissions.reduce((acc, sub) => {
      const eventName = sub.eventName || `Event ${sub.eventId}`;
      acc[eventName] = (acc[eventName] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return { total, submitted, pending, judged, winners, byEvent };
  };

  const stats = getSubmissionStats();

  if (loading) {
    return <LoadingState />;
  }

  // Redirect non-authorized users
  if (user?.role !== 'organizer' && user?.role !== 'judge') {
    return (
      <div className="container mx-auto p-6 max-w-7xl">
        <div className="text-center py-12">
          <Trophy className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="font-medium mb-2">Access Denied</h3>
          <p className="text-sm text-muted-foreground">
            Only organizers and judges can view all submissions.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">All Submissions</h1>
          <p className="text-muted-foreground mt-1">
            Review and manage project submissions across all events
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <Card key="total">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-blue-600" />
              <div>
                <p className="text-sm text-muted-foreground">Total</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card key="submitted">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <div>
                <p className="text-sm text-muted-foreground">Submitted</p>
                <p className="text-2xl font-bold">{stats.submitted}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card key="pending">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-orange-600" />
              <div>
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold">{stats.pending}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card key="judged">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Trophy className="h-4 w-4 text-purple-600" />
              <div>
                <p className="text-sm text-muted-foreground">Judged</p>
                <p className="text-2xl font-bold">{stats.judged}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card key="winners">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Award className="h-4 w-4 text-yellow-600" />
              <div>
                <p className="text-sm text-muted-foreground">Winners</p>
                <p className="text-2xl font-bold">{stats.winners}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1">
          <Input
            placeholder="Search submissions, teams, or descriptions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>
        <Select value={selectedEvent} onValueChange={setSelectedEvent}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="All Events" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Events</SelectItem>
            {events.filter(event => event.id).map((event) => (
              <SelectItem key={event.id} value={event.id.toString()}>
                {event.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={selectedTrack} onValueChange={setSelectedTrack}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="All Tracks" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Tracks</SelectItem>
            {tracks.map((track) => (
              <SelectItem key={track} value={track}>
                {track}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={selectedJudgingStatus} onValueChange={setSelectedJudgingStatus}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="in-review">In Review</SelectItem>
            <SelectItem value="judged">Judged</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Submissions List */}
      <div className="space-y-4">
        {filteredSubmissions.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="font-medium mb-2">No submissions found</h3>
            <p className="text-sm text-muted-foreground">
              Try adjusting your filters or search terms.
            </p>
          </div>
        ) : (
          filteredSubmissions.map((submission) => (
            <Card key={submission._id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1 space-y-3">
                    {/* Header */}
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-foreground mb-1">
                          {submission.title}
                        </h3>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Users className="h-4 w-4" />
                          <span>{submission.teamName || `Team ${submission.teamId}`}</span>
                          <span>•</span>
                          <span>{submission.eventName || `Event ${submission.eventId}`}</span>
                          {submission.round > 1 && (
                            <span key={`round-${submission._id}`}>
                              <span>•</span>
                              <span>Round {submission.round}</span>
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge 
                          variant={submission.submittedAt ? "default" : "secondary"}
                          className={submission.submittedAt ? "bg-green-100 text-green-800" : ""}
                        >
                          {submission.submittedAt ? "Submitted" : "Draft"}
                        </Badge>
                        <Badge variant="outline">{submission.track}</Badge>
                        <Badge 
                          variant={
                            submission.judgingStatus === 'judged' ? 'default' : 
                            submission.judgingStatus === 'in-review' ? 'secondary' : 
                            'outline'
                          }
                          className={
                            submission.judgingStatus === 'judged' ? 'bg-purple-100 text-purple-800' :
                            submission.judgingStatus === 'in-review' ? 'bg-orange-100 text-orange-800' :
                            'bg-gray-100 text-gray-800'
                          }
                        >
                          {submission.judgingStatus === 'pending' ? 'Pending Review' :
                           submission.judgingStatus === 'in-review' ? 'In Review' :
                           'Judged'}
                        </Badge>
                        {submission.isWinner && (
                          <Badge key={`winner-${submission._id}`} className="bg-yellow-100 text-yellow-800">
                            <Star className="h-3 w-3 mr-1" />
                            {submission.prize || 'Winner'}
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {submission.description}
                    </p>

                    {/* Links */}
                    <div className="flex items-center gap-4">
                      {submission.githubUrl && (
                        <a
                          key={`github-${submission._id}`}
                          href={submission.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800"
                        >
                          <Github className="h-4 w-4" />
                          GitHub
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      )}
                      {submission.videoUrl && (
                        <a
                          key={`video-${submission._id}`}
                          href={submission.videoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800"
                        >
                          <Video className="h-4 w-4" />
                          Demo Video
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      )}
                      {submission.docs && submission.docs.length > 0 && (
                        <div key={`docs-${submission._id}`} className="flex items-center gap-1 text-sm text-muted-foreground">
                          <FileText className="h-4 w-4" />
                          {submission.docs.length} document{submission.docs.length > 1 ? 's' : ''}
                        </div>
                      )}
                    </div>

                    {/* Judging Information */}
                    {submission.judgingStatus === 'judged' && submission.totalScore && (
                      <div key={`judging-info-${submission._id}`} className="flex items-center gap-4 p-3 bg-purple-50 rounded-lg">
                        <div className="flex items-center gap-2">
                          <Trophy className="h-4 w-4 text-purple-600" />
                          <span className="text-sm font-medium text-purple-900">
                            Score: {submission.totalScore}/50
                          </span>
                        </div>
                        {submission.judgeName && (
                          <div key={`judge-${submission._id}`} className="flex items-center gap-2">
                            <Users className="h-4 w-4 text-purple-600" />
                            <span className="text-sm text-purple-700">
                              Judged by {submission.judgeName}
                            </span>
                          </div>
                        )}
                        {submission.rank && (
                          <div key={`rank-${submission._id}`} className="flex items-center gap-2">
                            <Award className="h-4 w-4 text-purple-600" />
                            <span className="text-sm text-purple-700">
                              Rank #{submission.rank}
                            </span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Judge Comments */}
                    {submission.judgeComments && (
                      <div key={`comments-${submission._id}`} className="p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <MessageSquare className="h-4 w-4 text-gray-600" />
                          <span className="text-sm font-medium text-gray-900">Judge Comments</span>
                        </div>
                        <p className="text-sm text-gray-700 italic">"{submission.judgeComments}"</p>
                      </div>
                    )}

                    {/* Timestamp */}
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>
                          {submission.submittedAt ? 'Submitted' : 'Updated'} {' '}
                          {formatDistanceToNow(new Date(submission.submittedAt || submission.updatedAt))} ago
                        </span>
                      </div>
                      {submission.judgedAt && (
                        <div key={`judged-time-${submission._id}`} className="flex items-center gap-1">
                          <Trophy className="h-3 w-3" />
                          <span>
                            Judged {formatDistanceToNow(new Date(submission.judgedAt))} ago
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 ml-4">
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-1" />
                      View Details
                    </Button>
                    {submission.judgingStatus !== 'judged' ? (
                      <Button size="sm" className="bg-purple-600 hover:bg-purple-700" onClick={() => handleJudgeSubmission(submission)}>
                        <Edit className="h-4 w-4 mr-1" />
                        Judge Now
                      </Button>
                    ) : (
                      <Button variant="outline" size="sm" onClick={() => handleJudgeSubmission(submission)}>
                        <Edit className="h-4 w-4 mr-1" />
                        Edit Score
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Judging Dialog */}
      {selectedSubmission && (
        <JudgingDialog
          submission={selectedSubmission}
          isOpen={isJudgingDialogOpen}
          onClose={() => {
            setIsJudgingDialogOpen(false);
            setSelectedSubmission(null);
          }}
          onUpdate={handleJudgingUpdate}
        />
      )}
    </div>
  );
}
