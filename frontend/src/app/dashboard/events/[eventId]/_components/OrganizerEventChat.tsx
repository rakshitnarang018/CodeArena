'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useChatQna, ChatMessage } from '@/hooks/useChatQna';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
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
} from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';

interface OrganizerEventChatProps {
  eventId: string;
  isOrganizer: boolean;
}

const OrganizerEventChat: React.FC<OrganizerEventChatProps> = ({ eventId, isOrganizer }) => {
  const { user } = useAuth();
  const { messages, loading, error, addReply, deleteMessage, deleteReply, loadMore, pagination } = useChatQna(eventId);
  
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmitReply = async (chatId: string) => {
    if (!replyText.trim()) {
      toast.error('Please enter a reply');
      return;
    }

    setSubmitting(true);
    const result = await addReply(chatId, replyText);
    
    if (result.success) {
      setReplyText('');
      setReplyingTo(null);
      toast.success('Reply sent successfully');
    } else {
      toast.error(result.error || 'Failed to send reply');
    }
    setSubmitting(false);
  };

  const handleDeleteMessage = async (messageId: string) => {
    const result = await deleteMessage(messageId);
    
    if (result.success) {
      toast.success('Question deleted successfully');
    } else {
      toast.error(result.error || 'Failed to delete question');
    }
  };

  const handleDeleteReply = async (chatId: string, replyId: string) => {
    const result = await deleteReply(chatId, replyId);
    
    if (result.success) {
      toast.success('Reply deleted successfully');
    } else {
      toast.error(result.error || 'Failed to delete reply');
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

  const canDeleteMessage = (message: ChatMessage) => {
    return isOrganizer || (user && user.id === message.fromUserId.toString());
  };

  const canDeleteReply = (reply: any) => {
    return isOrganizer || (user && user.id === reply.fromUserId.toString());
  };

  const getUnansweredQuestions = () => {
    return messages.filter(message => message.replies.length === 0);
  };

  const getAnsweredQuestions = () => {
    return messages.filter(message => message.replies.length > 0);
  };

  if (loading && messages.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading event chat...</p>
        </div>
      </div>
    );
  }

  const unansweredQuestions = getUnansweredQuestions();
  const answeredQuestions = getAnsweredQuestions();

  return (
    <div className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

      {/* Questions List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            Event Questions & Answers
            {isOrganizer && (
              <Badge variant="secondary" className="ml-2">
                <Shield className="h-3 w-3 mr-1" />
                Organizer View
              </Badge>
            )}
          </CardTitle>
          <CardDescription>
            {isOrganizer 
              ? "Manage questions from participants and provide answers."
              : "View questions and answers from the event organizers."
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          {messages.length === 0 ? (
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No questions yet</h3>
              <p className="text-muted-foreground">
                Questions from participants will appear here.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Unanswered Questions First */}
              {unansweredQuestions.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <AlertCircle className="h-4 w-4 text-orange-500" />
                    <h3 className="font-medium text-orange-700">
                      Unanswered Questions ({unansweredQuestions.length})
                    </h3>
                  </div>
                  <div className="space-y-4">
                    {unansweredQuestions.map((message) => (
                      <div key={message._id} className="border border-orange-200 rounded-lg p-4 bg-orange-50/50">
                        {/* Question */}
                        <div className="flex items-start gap-3 mb-4">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="text-xs">
                              {message.userDetails?.name?.charAt(0).toUpperCase() || 'U'}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium text-sm">
                                {message.userDetails?.name || 'Anonymous'}
                              </span>
                              <Badge className={getRoleBadgeColor(message.userDetails?.role || '')} variant="secondary">
                                {message.userDetails?.role || 'user'}
                              </Badge>
                              <span className="text-xs text-muted-foreground">
                                {format(new Date(message.createdAt), 'MMM dd, yyyy • HH:mm')}
                              </span>
                            </div>
                            <p className="text-sm">{message.message}</p>
                          </div>
                          
                          {canDeleteMessage(message) && (
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
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
                          )}
                        </div>

                        {/* Reply Form */}
                        {isOrganizer && (
                          <div className="ml-11">
                            {replyingTo === message._id ? (
                              <div className="space-y-2">
                                <Textarea
                                  placeholder="Write your answer..."
                                  value={replyText}
                                  onChange={(e) => setReplyText(e.target.value)}
                                  rows={3}
                                  className="text-sm"
                                />
                                <div className="flex gap-2">
                                  <Button 
                                    size="sm" 
                                    onClick={() => handleSubmitReply(message._id)}
                                    disabled={submitting || !replyText.trim()}
                                  >
                                    {submitting ? (
                                      <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                                    ) : (
                                      <Send className="h-3 w-3 mr-1" />
                                    )}
                                    Send Answer
                                  </Button>
                                  <Button 
                                    size="sm" 
                                    variant="outline" 
                                    onClick={() => {
                                      setReplyingTo(null);
                                      setReplyText('');
                                    }}
                                  >
                                    Cancel
                                  </Button>
                                </div>
                              </div>
                            ) : (
                              <Button 
                                size="sm" 
                                onClick={() => setReplyingTo(message._id)}
                                className="bg-orange-600 hover:bg-orange-700"
                              >
                                <Reply className="h-3 w-3 mr-1" />
                                Answer Question
                              </Button>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Answered Questions */}
              {answeredQuestions.length > 0 && (
                <div>
                  {unansweredQuestions.length > 0 && <Separator />}
                  <div className="flex items-center gap-2 mb-4">
                    <Shield className="h-4 w-4 text-green-500" />
                    <h3 className="font-medium text-green-700">
                      Answered Questions ({answeredQuestions.length})
                    </h3>
                  </div>
                  <div className="space-y-4">
                    {answeredQuestions.map((message) => (
                      <div key={message._id} className="border rounded-lg p-4">
                        {/* Question */}
                        <div className="flex items-start gap-3 mb-4">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="text-xs">
                              {message.userDetails?.name?.charAt(0).toUpperCase() || 'U'}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium text-sm">
                                {message.userDetails?.name || 'Anonymous'}
                              </span>
                              <Badge className={getRoleBadgeColor(message.userDetails?.role || '')} variant="secondary">
                                {message.userDetails?.role || 'user'}
                              </Badge>
                              <span className="text-xs text-muted-foreground">
                                {format(new Date(message.createdAt), 'MMM dd, yyyy • HH:mm')}
                              </span>
                            </div>
                            <p className="text-sm">{message.message}</p>
                          </div>
                          
                          {canDeleteMessage(message) && (
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
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
                          )}
                        </div>

                        {/* Replies */}
                        <div className="ml-11 space-y-3">
                          <Separator />
                          {message.replies.map((reply) => (
                            <div key={reply._id} className="flex items-start gap-3 bg-green-50 p-3 rounded-lg">
                              <Avatar className="h-6 w-6">
                                <AvatarFallback className="text-xs">
                                  {reply.userDetails?.name?.charAt(0).toUpperCase() || 'O'}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="font-medium text-xs">
                                    {reply.userDetails?.name || 'Organizer'}
                                  </span>
                                  <Badge className={getRoleBadgeColor(reply.userDetails?.role || 'organizer')} variant="secondary">
                                    {reply.userDetails?.role || 'organizer'}
                                  </Badge>
                                  <span className="text-xs text-muted-foreground">
                                    {format(new Date(reply.createdAt), 'MMM dd • HH:mm')}
                                  </span>
                                </div>
                                <p className="text-xs">{reply.message}</p>
                              </div>
                              
                              {canDeleteReply(reply) && (
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
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
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Load More */}
              {pagination && pagination.hasNext && (
                <div className="text-center">
                  <Button 
                    variant="outline" 
                    onClick={loadMore}
                    disabled={loading}
                  >
                    {loading ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : null}
                    Load More Questions
                  </Button>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default OrganizerEventChat;
