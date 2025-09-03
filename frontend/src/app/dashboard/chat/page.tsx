'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { eventsAPI, chatQnaAPI } from '@/lib/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  MessageCircle,
  Send,
  Reply,
  MoreVertical,
  Trash2,
  Loader2,
  AlertCircle,
  Users,
  Shield,
  Calendar,
  RefreshCw,
  Eye,
} from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';

interface Event {
  EventID: number;
  Name: string;
  Status: string;
  StartDate: string;
  EndDate: string;
  OrganizerID?: number;
  organizerId?: number;
  organizer_id?: number;
}

interface ChatMessage {
  _id: string;
  eventId: number;
  fromUserId: number;
  message: string;
  replies: Array<{
    _id: string;
    fromUserId: number;
    message: string;
    createdAt: string;
    userDetails?: {
      name: string;
      role: string;
    };
  }>;
  createdAt: string;
  updatedAt: string;
  userDetails?: {
    name: string;
    role: string;
  };
  eventName?: string; 
}

const EventChatManagementPage = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEventId, setSelectedEventId] = useState<string>('all');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [eventsLoading, setEventsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [submitting, setSubmitting] = useState(false);

  
  useEffect(() => {
    const fetchEvents = async () => {
      setEventsLoading(true);
      try {
        if (!user?.id) {
          setEventsLoading(false);
          return;
        }

        const response = await eventsAPI.getByOrganizer(user.id.toString()) as { 
          success: boolean; 
          data: Event[];
          pagination?: any;
        };
        
        if (response.success) {
          setEvents(response.data || []);
        } else {
          setEvents([]);
        }
      } catch (err) {
        console.error('Error fetching organizer events:', err);
        toast.error('Failed to fetch events');
        setEvents([]);
      } finally {
        setEventsLoading(false);
      }
    };

    if (user?.role === 'organizer') {
      fetchEvents();
    }
  }, [user]);

  
  const fetchMessages = async () => {
    if (events.length === 0) {
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      let allMessages: ChatMessage[] = [];
      
      if (selectedEventId === 'all') {
        
        const messagePromises = events.map(async (event) => {
          try {
            const response = await chatQnaAPI.getByEvent(event.EventID.toString(), 1, 50) as {
              success: boolean;
              data: ChatMessage[];
            };
            if (response.success) {
              return response.data.map(msg => ({ ...msg, eventName: event.Name }));
            }
            return [];
          } catch (err) {
            console.error(`Error fetching messages for event ${event.EventID}:`, err);
            return [];
          }
        });
        
        const results = await Promise.all(messagePromises);
        allMessages = results.flat();
      } else {
        
        const response = await chatQnaAPI.getByEvent(selectedEventId, 1, 50) as {
          success: boolean;
          data: ChatMessage[];
        };
        if (response.success) {
          const eventName = events.find(e => e.EventID.toString() === selectedEventId)?.Name;
          allMessages = response.data.map(msg => ({ ...msg, eventName }));
        }
      }
      
      
      allMessages.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setMessages(allMessages);
      
    } catch (err) {
      console.error('Error in fetchMessages:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch messages');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!eventsLoading && events.length > 0) {
      fetchMessages();
    } else if (!eventsLoading && events.length === 0) {
      setMessages([]);
    }
  }, [selectedEventId, events, eventsLoading]);

  const handleSubmitReply = async (chatId: string) => {
    if (!replyText.trim()) {
      toast.error('Please enter a reply');
      return;
    }

    setSubmitting(true);
    try {
      const response = await chatQnaAPI.addReply(chatId, replyText.trim()) as {
        success: boolean;
        data: any;
        message: string;
      };
      
      if (response.success) {
        setReplyText('');
        setReplyingTo(null);
        toast.success('Reply sent successfully');
        
        await fetchMessages();
      } else {
        toast.error(response.message || 'Failed to send reply');
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to send reply');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteMessage = async (messageId: string) => {
    try {
      const response = await chatQnaAPI.delete(messageId) as {
        success: boolean;
        message: string;
      };
      
      if (response.success) {
        toast.success('Question deleted successfully');
        
        await fetchMessages();
      } else {
        toast.error(response.message || 'Failed to delete question');
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to delete question');
    }
  };

  const handleDeleteReply = async (chatId: string, replyId: string) => {
    try {
      const response = await chatQnaAPI.deleteReply(chatId, replyId) as {
        success: boolean;
        message: string;
      };
      
      if (response.success) {
        toast.success('Reply deleted successfully');
        
        await fetchMessages();
      } else {
        toast.error(response.message || 'Failed to delete reply');
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to delete reply');
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role?.toLowerCase()) {
      case 'organizer': return 'bg-purple-100 text-purple-800';
      case 'judge': return 'bg-orange-100 text-orange-800';
      case 'participant': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getUnansweredQuestions = () => {
    return messages.filter(message => message.replies.length === 0);
  };

  const getAnsweredQuestions = () => {
    return messages.filter(message => message.replies.length > 0);
  };

  const unansweredQuestions = getUnansweredQuestions();
  const answeredQuestions = getAnsweredQuestions();

  if (user?.role !== 'organizer') {
    return (
      <div className="flex items-center justify-center h-64">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Access denied. This page is only available for event organizers.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  
  if (eventsLoading) {
    return (
      <div className="p-6 space-y-6 max-w-7xl mx-auto">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Loading your events...</p>
          </div>
        </div>
      </div>
    );
  }

  
  if (!eventsLoading && events.length === 0) {
    return (
      <div className="p-6 space-y-6 max-w-7xl mx-auto">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Event Chat Management</h1>
            <p className="text-muted-foreground">
              Manage questions and answers from all your events
            </p>
          </div>
        </div>
        
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <Calendar className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No Events Found</h3>
            <p className="text-muted-foreground mb-4">
              You haven't created any events yet. Create your first event to start receiving questions from participants.
            </p>
            <Button asChild>
              <a href="/dashboard/events/create">
                Create Your First Event
              </a>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Event Chat Management</h1>
          <p className="text-muted-foreground">
            Manage questions and answers from all your events
          </p>
        </div>
        <Button onClick={fetchMessages} variant="outline" size="sm" disabled={loading}>
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Event Filter */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Filter by Event</CardTitle>
        </CardHeader>
        <CardContent>
          {eventsLoading ? (
            <div className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="text-sm text-muted-foreground">Loading events...</span>
            </div>
          ) : (
            <Select value={selectedEventId} onValueChange={setSelectedEventId}>
              <SelectTrigger className="w-[300px]">
                <SelectValue placeholder="Select an event" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Events ({events.length})</SelectItem>
                {events.map((event) => (
                  <SelectItem key={event.EventID} value={event.EventID.toString()}>
                    {event.Name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </CardContent>
      </Card>

      {/* Stats Cards */}
      {!eventsLoading && events.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div className="ml-2">
                  <p className="text-sm font-medium">Total Events</p>
                  <p className="text-2xl font-bold">{events.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <MessageCircle className="h-4 w-4 text-muted-foreground" />
                <div className="ml-2">
                  <p className="text-sm font-medium">Total Questions</p>
                  <p className="text-2xl font-bold">{messages.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <AlertCircle className="h-4 w-4 text-orange-500" />
                <div className="ml-2">
                  <p className="text-sm font-medium">Unanswered</p>
                  <p className="text-2xl font-bold text-orange-500">{unansweredQuestions.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <Shield className="h-4 w-4 text-green-500" />
                <div className="ml-2">
                  <p className="text-sm font-medium">Answered</p>
                  <p className="text-2xl font-bold text-green-500">{answeredQuestions.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Messages Section */}
      <Tabs defaultValue="unanswered" className="space-y-4">
        <TabsList>
          <TabsTrigger value="unanswered" className="relative">
            Unanswered Questions
            {unansweredQuestions.length > 0 && (
              <Badge variant="destructive" className="ml-2 text-xs">
                {unansweredQuestions.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="answered">
            Answered Questions ({answeredQuestions.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="unanswered">
          <Card >
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-orange-500" />
                Unanswered Questions
              </CardTitle>
              <CardDescription>
                Questions that need your attention and response
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center h-32">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </div>
              ) : unansweredQuestions.length === 0 ? (
                <div className="text-center py-8">
                  <Shield className="h-12 w-12 text-green-500 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">All caught up!</h3>
                  <p className="text-muted-foreground">
                    No unanswered questions at the moment.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {unansweredQuestions.map((message) => (
                    <div key={message._id} className="bg-primary/30 border border-orange-200 rounded-xl p-6 hover:shadow-md transition-all duration-200 bg-gradient-to-br from-orange-50/30 to-amber-50/30">
                      {/* Event Name */}
                      {selectedEventId === 'all' && (
                        <div className="mb-3">
                          <Badge variant="outline" className="text-xs border-orange-200 text-orange-700 bg-primary-50">
                            <Calendar className="h-3 w-3 mr-1" />
                            {message.eventName}
                          </Badge>
                        </div>
                      )}
                      
                      {/* Question */}
                      <div className="flex items-start gap-4 mb-6">
                        <Avatar className="h-10 w-10 border-2 border-orange-200">
                          <AvatarFallback className="text-sm font-medium bg-gradient-to-br from-orange-100 to-amber-100">
                            {message.userDetails?.name?.charAt(0).toUpperCase() || 'U'}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="font-semibold text-base text-slate-800">
                              {message.userDetails?.name || 'Anonymous'}
                            </span>
                            <Badge className={getRoleBadgeColor(message.userDetails?.role || '')} variant="secondary">
                              {message.userDetails?.role || 'user'}
                            </Badge>
                            <span className="text-xs text-slate-500">
                              {format(new Date(message.createdAt), 'MMM dd, yyyy • HH:mm')}
                            </span>
                            <Badge variant="outline" className="text-xs text-orange-600 border-orange-200 bg-orange-50">
                              ⏳ Awaiting Answer
                            </Badge>
                          </div>
                          <div className="bg-white/60 border border-orange-200 rounded-lg p-4 backdrop-blur-sm">
                            <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
                              {message.message}
                            </p>
                          </div>
                        </div>
                        
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-orange-100">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem 
                              onClick={() => handleDeleteMessage(message._id)}
                              className="text-red-600"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>

                      {/* Reply Form */}
                      <div className="ml-11">
                        {replyingTo === message._id ? (
                          <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg space-y-3">
                            <div className="flex items-start gap-3">
                              <Avatar className="h-7 w-7 border border-blue-200">
                                <AvatarFallback className="text-xs bg-gradient-to-br from-blue-100 to-blue-200">
                                  {user?.name?.charAt(0).toUpperCase() || 'U'}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1">
                                <Textarea
                                  placeholder="Write your official answer..."
                                  value={replyText}
                                  onChange={(e) => setReplyText(e.target.value)}
                                  rows={3}
                                  className="min-h-[70px] resize-none border-blue-200 focus:border-blue-400 focus:ring-blue-200 bg-white/80 backdrop-blur-sm"
                                />
                              </div>
                            </div>
                            
                            <div className="flex justify-between items-center">
                              <div className="flex items-center gap-2 text-xs text-blue-600">
                                <MessageCircle className="h-3 w-3" />
                                <span>Replying as {user?.name}</span>
                                <Badge className="text-xs bg-purple-100 text-purple-600 border-purple-200">
                                  ✓ Official Answer
                                </Badge>
                              </div>
                              
                              <div className="flex gap-2">
                                <Button 
                                  size="sm" 
                                  variant="ghost"
                                  onClick={() => {
                                    setReplyingTo(null);
                                    setReplyText('');
                                  }}
                                  className="text-slate-600 hover:text-slate-800 hover:bg-blue-100"
                                >
                                  Cancel
                                </Button>
                                <Button 
                                  size="sm" 
                                  onClick={() => handleSubmitReply(message._id)}
                                  disabled={submitting || !replyText.trim()}
                                  className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-sm"
                                >
                                  {submitting ? (
                                    <>
                                      <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                                      Posting...
                                    </>
                                  ) : (
                                    <>
                                      <Send className="h-3 w-3 mr-1" />
                                      Post Answer
                                    </>
                                  )}
                                </Button>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <div className="h-px bg-border flex-1" />
                            <Button 
                              size="sm" 
                              onClick={() => setReplyingTo(message._id)}
                              className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-sm"
                            >
                              <Reply className="h-3 w-3 mr-1" />
                              Answer Question
                            </Button>
                            <div className="h-px bg-border flex-1" />
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="answered">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-green-500" />
                Answered Questions
              </CardTitle>
              <CardDescription>
                Questions that have been answered
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center h-32">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </div>
              ) : answeredQuestions.length === 0 ? (
                <div className="text-center py-8">
                  <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No answered questions yet</h3>
                  <p className="text-muted-foreground">
                    Answered questions will appear here.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {answeredQuestions.map((message) => (
                    <div key={message._id} className="bg-white border border-slate-200 rounded-xl p-6 hover:shadow-md transition-all duration-200">
                      {/* Event Name */}
                      {selectedEventId === 'all' && (
                        <div className="mb-3">
                          <Badge variant="outline" className="text-xs border-green-200 text-green-700 bg-green-50">
                            <Calendar className="h-3 w-3 mr-1" />
                            {message.eventName}
                          </Badge>
                        </div>
                      )}
                      
                      {/* Question */}
                      <div className="flex items-start gap-4 mb-6">
                        <Avatar className="h-10 w-10 border-2 border-slate-200">
                          <AvatarFallback className="text-sm font-medium bg-gradient-to-br from-blue-100 to-purple-100">
                            {message.userDetails?.name?.charAt(0).toUpperCase() || 'U'}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="font-semibold text-base text-slate-800">
                              {message.userDetails?.name || 'Anonymous'}
                            </span>
                            <Badge className={getRoleBadgeColor(message.userDetails?.role || '')} variant="secondary">
                              {message.userDetails?.role || 'user'}
                            </Badge>
                            <span className="text-xs text-slate-500">
                              {format(new Date(message.createdAt), 'MMM dd, yyyy • HH:mm')}
                            </span>
                            <Badge variant="outline" className="text-xs text-green-600 border-green-200 bg-green-50">
                              ✅ Answered
                            </Badge>
                          </div>
                          <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                            <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
                              {message.message}
                            </p>
                          </div>
                        </div>
                        
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-slate-100">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem 
                              onClick={() => handleDeleteMessage(message._id)}
                              className="text-red-600"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>

                      {/* Replies */}
                      <div className="ml-11 space-y-3">
                        <div className="flex items-center gap-2">
                          <Separator className="flex-1" />
                          <Badge variant="secondary" className="text-xs px-2 py-1">
                            {message.replies.length} {message.replies.length === 1 ? 'Answer' : 'Answers'}
                          </Badge>
                          <Separator className="flex-1" />
                        </div>
                        
                        <div className="space-y-3">
                          {message.replies.map((reply, index) => (
                            <div key={reply._id} className="relative">
                              {/* Reply connector line */}
                              <div className="absolute left-4 top-0 bottom-0 w-px bg-border" />
                              
                              <div className="flex items-start gap-4 relative">
                                {/* Avatar with connector */}
                                <div className="relative">
                                  <Avatar className="h-8 w-8 border-2 border-background">
                                    <AvatarFallback className="text-xs font-medium bg-gradient-to-br from-blue-100 to-green-100">
                                      {reply.userDetails?.name?.charAt(0).toUpperCase() || 'O'}
                                    </AvatarFallback>
                                  </Avatar>
                                  {/* Role indicator */}
                                  {reply.userDetails?.role === 'organizer' && (
                                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-purple-500 rounded-full border border-background flex items-center justify-center">
                                      <Shield className="h-1.5 w-1.5 text-white" />
                                    </div>
                                  )}
                                </div>
                                
                                {/* Reply Content */}
                                <div className="flex-1 bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200 rounded-lg p-4 shadow-sm">
                                  <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                      <span className="font-semibold text-sm text-slate-700">
                                        {reply.userDetails?.name || 'Organizer'}
                                      </span>
                                      <Badge 
                                        className={`text-xs ${getRoleBadgeColor(reply.userDetails?.role || 'organizer')}`} 
                                        variant="secondary"
                                      >
                                        {reply.userDetails?.role || 'organizer'}
                                      </Badge>
                                      {reply.userDetails?.role === 'organizer' && (
                                        <Badge className="text-xs bg-purple-100 text-purple-700 border-purple-200">
                                          ✓ Official Answer
                                        </Badge>
                                      )}
                                    </div>
                                    
                                    <div className="flex items-center gap-2">
                                      <span className="text-xs text-slate-500">
                                        {format(new Date(reply.createdAt), 'MMM dd • HH:mm')}
                                      </span>
                                      <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                          <Button variant="ghost" size="sm" className="h-6 w-6 p-0 hover:bg-slate-200">
                                            <MoreVertical className="h-3 w-3" />
                                          </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                          <DropdownMenuItem 
                                            onClick={() => handleDeleteReply(message._id, reply._id)}
                                            className="text-red-600"
                                          >
                                            <Trash2 className="h-3 w-3 mr-2" />
                                            Delete
                                          </DropdownMenuItem>
                                        </DropdownMenuContent>
                                      </DropdownMenu>
                                    </div>
                                  </div>
                                  
                                  <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
                                    {reply.message}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EventChatManagementPage;
