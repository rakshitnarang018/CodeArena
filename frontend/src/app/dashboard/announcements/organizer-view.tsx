'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Plus,
  Megaphone,
  Edit,
  Trash2,
  Calendar,
  Users,
  Filter,
  Search,
  Star
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { apiRequest } from '@/lib/api';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';
import { AnnouncementForm } from './_components/AnnouncementForm';

interface Announcement {
  _id: string;
  eventId: number;
  title: string;
  message: string;
  priority: 'low' | 'medium' | 'high';
  isImportant: boolean;
  createdAt: string;
  updatedAt: string;
  eventName?: string;
}

interface Event {
  EventID: number;
  Name: string;
  IsActive: boolean;
}

export default function OrganizerAnnouncementsView() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [eventFilter, setEventFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null);

  useEffect(() => {
    fetchMyEvents();
    fetchAllAnnouncements();
  }, []);

  const fetchMyEvents = async () => {
    try {
      // Get events organized by current user
      const response = await apiRequest<{ data: Event[] }>('/events');
      setEvents(response.data || []);
    } catch (error) {
      console.error('Error fetching events:', error);
      toast.error('Failed to fetch events');
    }
  };

  const fetchAllAnnouncements = async () => {
    try {
      setLoading(true);
      // Use the new endpoint to get all announcements for organizer
      const response = await apiRequest<{ data: Announcement[] }>('/announcements');
      setAnnouncements(response.data || []);
    } catch (error) {
      console.error('Error fetching announcements:', error);
      toast.error('Failed to fetch announcements');
    } finally {
      setLoading(false);
    }
  };

  const fetchAnnouncementsForEvent = async (eventId: number) => {
    try {
      const response = await apiRequest<{ data: Announcement[] }>(`/announcements/event/${eventId}`);
      return response.data || [];
    } catch (error) {
      console.error(`Error fetching announcements for event ${eventId}:`, error);
      return [];
    }
  };

  const handleCreateAnnouncement = async (announcementData: Partial<Announcement>) => {
    try {
      const response = await apiRequest('/announcements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(announcementData)
      });
      
      toast.success('Announcement created successfully!');
      setShowCreateForm(false);
      fetchAllAnnouncements();
    } catch (error: any) {
      console.error('Error creating announcement:', error);
      toast.error(error.message || 'Failed to create announcement');
    }
  };

  const handleUpdateAnnouncement = async (id: string, announcementData: Partial<Announcement>) => {
    try {
      await apiRequest(`/announcements/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(announcementData)
      });
      
      toast.success('Announcement updated successfully!');
      setEditingAnnouncement(null);
      fetchAllAnnouncements();
    } catch (error: any) {
      console.error('Error updating announcement:', error);
      toast.error(error.message || 'Failed to update announcement');
    }
  };

  const handleDeleteAnnouncement = async (id: string) => {
    if (!confirm('Are you sure you want to delete this announcement?')) {
      return;
    }

    try {
      await apiRequest(`/announcements/${id}`, {
        method: 'DELETE'
      });
      
      toast.success('Announcement deleted successfully!');
      fetchAllAnnouncements();
    } catch (error: any) {
      console.error('Error deleting announcement:', error);
      toast.error(error.message || 'Failed to delete announcement');
    }
  };

  const filteredAnnouncements = announcements.filter(announcement => {
    const matchesSearch = announcement.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         announcement.message.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesEvent = eventFilter === 'all' || announcement.eventId.toString() === eventFilter;
    const matchesPriority = priorityFilter === 'all' || announcement.priority === priorityFilter;
    return matchesSearch && matchesEvent && matchesPriority;
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Announcement Management</h1>
        </div>
        <div className="grid gap-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="h-3 bg-gray-200 rounded"></div>
                  <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Megaphone className="h-8 w-8" />
          Announcement Management
        </h1>
        <Button onClick={() => setShowCreateForm(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Create Announcement
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-full">
                <Megaphone className="h-4 w-4 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Announcements</p>
                <p className="text-2xl font-bold">{announcements.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-full">
                <Star className="h-4 w-4 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">High Priority</p>
                <p className="text-2xl font-bold">
                  {announcements.filter(a => a.priority === 'high').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-full">
                <Star className="h-4 w-4 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Important</p>
                <p className="text-2xl font-bold">
                  {announcements.filter(a => a.isImportant).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-full">
                <Calendar className="h-4 w-4 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Events</p>
                <p className="text-2xl font-bold">{events.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardHeader>
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search announcements..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={eventFilter} onValueChange={setEventFilter}>
              <SelectTrigger className="w-full lg:w-48">
                <SelectValue placeholder="Filter by event" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Events</SelectItem>
                {events.map((event) => (
                  <SelectItem key={event.EventID} value={event.EventID.toString()}>
                    {event.Name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-full lg:w-48">
                <SelectValue placeholder="Filter by priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priorities</SelectItem>
                <SelectItem value="high">High Priority</SelectItem>
                <SelectItem value="medium">Medium Priority</SelectItem>
                <SelectItem value="low">Low Priority</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
      </Card>

      {/* Announcements List */}
      <div className="space-y-4">
        {filteredAnnouncements.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Megaphone className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">No announcements found</h3>
              <p className="text-gray-500 mb-4">
                {searchTerm || eventFilter !== 'all' || priorityFilter !== 'all'
                  ? 'Try adjusting your search or filter criteria.'
                  : 'Create your first announcement to get started.'
                }
              </p>
              {announcements.length === 0 && (
                <Button onClick={() => setShowCreateForm(true)} className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Create First Announcement
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          filteredAnnouncements.map((announcement) => (
            <Card key={announcement._id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-1">{announcement.title}</h3>
                    <p className="text-gray-600 text-sm">
                      {announcement.eventName || 'Unknown Event'}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {announcement.isImportant && (
                      <Star className="h-4 w-4 text-yellow-500 fill-current" />
                    )}
                    <Badge className={getPriorityColor(announcement.priority)}>
                      {announcement.priority.toUpperCase()}
                    </Badge>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setEditingAnnouncement(announcement)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteAnnouncement(announcement._id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                                <p className="text-gray-700 mb-4">{announcement.message}</p>
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>Created {formatDistanceToNow(new Date(announcement.createdAt))} ago</span>
                  {announcement.updatedAt !== announcement.createdAt && (
                    <span>Updated {formatDistanceToNow(new Date(announcement.updatedAt))} ago</span>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Create/Edit Form Modal */}
      {(showCreateForm || editingAnnouncement) && (
        <AnnouncementForm
          isOpen={showCreateForm || !!editingAnnouncement}
          onClose={() => {
            setShowCreateForm(false);
            setEditingAnnouncement(null);
          }}
          onSubmit={editingAnnouncement 
            ? (data) => handleUpdateAnnouncement(editingAnnouncement._id, data)
            : handleCreateAnnouncement
          }
          initialData={editingAnnouncement}
          events={events}
        />
      )}
    </div>
  );
}
