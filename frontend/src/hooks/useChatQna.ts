import { useState, useEffect, useCallback } from 'react';
import { chatQnaAPI } from '@/lib/api';

export interface ChatReply {
  _id: string;
  fromUserId: number;
  message: string;
  createdAt: string;
  updatedAt: string;
  userDetails?: {
    name: string;
    role: string;
  };
}

export interface ChatMessage {
  _id: string;
  eventId: number;
  fromUserId: number;
  message: string;
  replies: ChatReply[];
  createdAt: string;
  updatedAt: string;
  userDetails?: {
    name: string;
    role: string;
  };
}

export interface ChatQnaResponse {
  success: boolean;
  message: string;
  data: ChatMessage[];
  pagination?: {
    currentPage: number;
    totalPages: number;
    totalMessages: number;
    hasNext: boolean;
    hasPrevious: boolean;
  };
}

export const useChatQna = (eventId: string) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<ChatQnaResponse['pagination'] | null>(null);

  const fetchMessages = useCallback(async (page: number = 1, limit: number = 20) => {
    if (!eventId) return;

    setLoading(true);
    setError(null);

    try {
      const response = await chatQnaAPI.getByEvent(eventId, page, limit) as ChatQnaResponse;
      
      if (response.success) {
        if (page === 1) {
          setMessages(response.data);
        } else {
          setMessages(prev => [...prev, ...response.data]);
        }
        setPagination(response.pagination || null);
      } else {
        setError(response.message || 'Failed to fetch messages');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch messages');
    } finally {
      setLoading(false);
    }
  }, [eventId]);

  const createMessage = useCallback(async (message: string): Promise<{ success: boolean; error?: string }> => {
    if (!eventId || !message.trim()) {
      return { success: false, error: 'Message cannot be empty' };
    }

    try {
      const response = await chatQnaAPI.create(eventId, message.trim()) as { success: boolean; message: string; data: ChatMessage };
      
      if (response.success) {
        // Add the new message to the beginning of the list
        setMessages(prev => [response.data, ...prev]);
        return { success: true };
      } else {
        return { success: false, error: response.message };
      }
    } catch (err) {
      return { 
        success: false, 
        error: err instanceof Error ? err.message : 'Failed to create message' 
      };
    }
  }, [eventId]);

  const addReply = useCallback(async (chatId: string, message: string): Promise<{ success: boolean; error?: string }> => {
    if (!message.trim()) {
      return { success: false, error: 'Reply cannot be empty' };
    }

    try {
      const response = await chatQnaAPI.addReply(chatId, message.trim()) as { success: boolean; message: string; data: ChatReply };
      
      if (response.success) {
        // Update the specific message with the new reply
        setMessages(prev => prev.map(msg => 
          msg._id === chatId 
            ? { ...msg, replies: [...msg.replies, response.data] }
            : msg
        ));
        return { success: true };
      } else {
        return { success: false, error: response.message };
      }
    } catch (err) {
      return { 
        success: false, 
        error: err instanceof Error ? err.message : 'Failed to add reply' 
      };
    }
  }, []);

  const deleteMessage = useCallback(async (messageId: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await chatQnaAPI.delete(messageId) as { success: boolean; message: string };
      
      if (response.success) {
        setMessages(prev => prev.filter(msg => msg._id !== messageId));
        return { success: true };
      } else {
        return { success: false, error: response.message };
      }
    } catch (err) {
      return { 
        success: false, 
        error: err instanceof Error ? err.message : 'Failed to delete message' 
      };
    }
  }, []);

  const deleteReply = useCallback(async (chatId: string, replyId: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await chatQnaAPI.deleteReply(chatId, replyId) as { success: boolean; message: string };
      
      if (response.success) {
        setMessages(prev => prev.map(msg => 
          msg._id === chatId 
            ? { ...msg, replies: msg.replies.filter(reply => reply._id !== replyId) }
            : msg
        ));
        return { success: true };
      } else {
        return { success: false, error: response.message };
      }
    } catch (err) {
      return { 
        success: false, 
        error: err instanceof Error ? err.message : 'Failed to delete reply' 
      };
    }
  }, []);

  const loadMore = useCallback(() => {
    if (pagination && pagination.hasNext) {
      fetchMessages(pagination.currentPage + 1);
    }
  }, [pagination, fetchMessages]);

  const refetch = useCallback(() => {
    fetchMessages(1);
  }, [fetchMessages]);

  useEffect(() => {
    if (eventId) {
      fetchMessages();
    }
  }, [eventId, fetchMessages]);

  return {
    messages,
    loading,
    error,
    pagination,
    createMessage,
    addReply,
    deleteMessage,
    deleteReply,
    loadMore,
    refetch,
  };
};
