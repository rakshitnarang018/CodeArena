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
  Edit,
  Trash2,
  Loader2,
  AlertCircle,
  Plus,
  Users,
  Shield,
} from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';

interface EventChatQnaProps {
  eventId: string;
}

const EventChatQna: React.FC<EventChatQnaProps> = ({ eventId }) => {
  const { user } = useAuth();
  const { messages, loading, error, createMessage, addReply, deleteMessage, deleteReply, loadMore, pagination } = useChatQna(eventId);
  
  const [newQuestion, setNewQuestion] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmitQuestion = async () => {
    if (!newQuestion.trim()) {
      toast.error('Please enter a question');
      return;
    }

    setSubmitting(true);
    const result = await createMessage(newQuestion);
    
    if (result.success) {
      setNewQuestion('');
      toast.success('Question posted successfully');
    } else {
      toast.error(result.error || 'Failed to post question');
    }
    setSubmitting(false);
  };

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
      toast.success('Reply added successfully');
    } else {
      toast.error(result.error || 'Failed to add reply');
    }
    setSubmitting(false);
  };

  const handleDeleteMessage = async (messageId: string) => {
    const result = await deleteMessage(messageId);
    
    if (result.success) {
      toast.success('Message deleted successfully');
    } else {
      toast.error(result.error || 'Failed to delete message');
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
    return user && (user.id === message.fromUserId.toString() || user.role === 'organizer');
  };

  const canDeleteReply = (reply: any) => {
    return user && (user.id === reply.fromUserId.toString() || user.role === 'organizer');
  };

  if (loading && messages.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading FAQ...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <MessageCircle className="h-6 w-6 text-primary" />
              </div>
              <div>
                <CardTitle className="text-xl">
                  Frequently Asked Questions
                </CardTitle>
                <CardDescription className="mt-1">
                  Get answers from organizers and community members. Open to everyone!
                </CardDescription>
              </div>
            </div>
            {messages.length > 0 && (
              <Badge variant="secondary" className="text-xs">
                {messages.length} {messages.length === 1 ? 'question' : 'questions'}
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Ask Question Form */}
          {user ? (
            <div className="mb-6 p-6 border-2 border-dashed border-primary/20 rounded-lg bg-primary/5 hover:bg-primary/10 transition-colors">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-primary/10 rounded-full">
                  <MessageCircle className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Have a Question?</h3>
                  <p className="text-sm text-muted-foreground">
                    Ask the organizers or browse existing questions below. No enrollment required!
                  </p>
                </div>
              </div>
              <Textarea
                placeholder="What would you like to know about this event? (e.g., registration details, requirements, schedule, etc.)"
                value={newQuestion}
                onChange={(e) => setNewQuestion(e.target.value)}
                className="mb-4 min-h-[100px] resize-none"
                rows={4}
              />
              <div className="flex items-center justify-between">
                <p className="text-xs text-muted-foreground">
                  💡 Tip: Check existing questions below before asking to avoid duplicates
                </p>
                <Button 
                  onClick={handleSubmitQuestion} 
                  disabled={submitting || !newQuestion.trim()}
                  className="px-6"
                >
                  {submitting ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4 mr-2" />
                  )}
                  Post Question
                </Button>
              </div>
            </div>
          ) : (
            <div className="mb-6 p-6 border-2 border-dashed border-orange-200 rounded-lg bg-orange-50">
              <div className="text-center">
                <MessageCircle className="h-12 w-12 text-orange-400 mx-auto mb-3" />
                <h3 className="font-semibold text-lg mb-2">Want to Ask a Question?</h3>
                <p className="text-muted-foreground mb-4">
                  Please log in to ask questions and interact with the event organizers
                </p>
                <Button variant="default" asChild>
                  <a href="/auth/login">
                    Log In to Ask Questions
                  </a>
                </Button>
              </div>
            </div>
          )}

          {/* Messages List */}
          {messages.length === 0 ? (
            <div className="text-center py-12">
              <div className="max-w-md mx-auto">
                <Users className="h-16 w-16 text-muted-foreground mx-auto mb-6" />
                <h3 className="text-xl font-semibold mb-3">No Questions Yet</h3>
                <p className="text-muted-foreground mb-6">
                  This event doesn't have any FAQ yet. Be the first to ask a question and help build the community knowledge base!
                </p>
                {user ? (
                  <div className="space-y-3">
                    <p className="text-sm font-medium text-primary">
                      Common questions you might want to ask:
                    </p>
                    <div className="grid grid-cols-1 gap-2 text-xs text-muted-foreground">
                      <p>• What are the registration requirements?</p>
                      <p>• What's the event schedule and timeline?</p>
                      <p>• Are there any prerequisites to participate?</p>
                      <p>• How will the judging/evaluation work?</p>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Please log in to ask questions and join the discussion.
                  </p>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {messages.map((message) => (
                <div key={message._id} className="bg-white border border-slate-200 rounded-xl p-6 hover:shadow-md transition-all duration-200">
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
                        {message.replies.length === 0 ? (
                          <Badge variant="outline" className="text-xs text-orange-600 border-orange-200 bg-orange-50">
                            ⏳ Awaiting Answer
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-xs text-green-600 border-green-200 bg-green-50">
                            ✅ Answered
                          </Badge>
                        )}
                      </div>
                      <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                        <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
                          {message.message}
                        </p>
                      </div>
                    </div>
                    
                    {canDeleteMessage(message) && (
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
                    )}
                  </div>

                  {/* Replies */}
                  {message.replies.length > 0 && (
                    <div className="ml-11 space-y-4 mb-4">
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
                                    {reply.userDetails?.name?.charAt(0).toUpperCase() || 'U'}
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
                                      {reply.userDetails?.name || 'Anonymous'}
                                    </span>
                                    <Badge 
                                      className={`text-xs ${getRoleBadgeColor(reply.userDetails?.role || '')}`} 
                                      variant="secondary"
                                    >
                                      {reply.userDetails?.role || 'user'}
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
                                    {canDeleteReply(reply) && (
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
                                    )}
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
                  )}

                  {/* Reply Form */}
                  {user && user.role === 'organizer' && (
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
                                rows={2}
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
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => setReplyingTo(message._id)}
                          className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 hover:from-blue-100 hover:to-indigo-100 text-blue-700"
                        >
                          <Reply className="h-3 w-3 mr-1" />
                          Reply as Organizer
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              ))}

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

export default EventChatQna;
