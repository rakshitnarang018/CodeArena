'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';

interface Event {
  EventID: number;
  Name: string;
  IsActive: boolean;
}

interface Announcement {
  _id?: string;
  eventId: number;
  title: string;
  message: string;
  priority: 'low' | 'medium' | 'high';
  isImportant: boolean;
}

interface AnnouncementFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<Announcement, '_id'>) => void;
  initialData?: Announcement | null;
  events: Event[];
}

export function AnnouncementForm({ 
  isOpen, 
  onClose, 
  onSubmit, 
  initialData, 
  events 
}: AnnouncementFormProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    eventId: '',
    title: '',
    message: '',
    priority: 'medium' as 'low' | 'medium' | 'high',
    isImportant: false
  });

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setFormData({
          eventId: initialData.eventId.toString(),
          title: initialData.title,
          message: initialData.message,
          priority: initialData.priority,
          isImportant: initialData.isImportant
        });
      } else {
        setFormData({
          eventId: '',
          title: '',
          message: '',
          priority: 'medium',
          isImportant: false
        });
      }
    }
  }, [isOpen, initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.eventId || !formData.title || !formData.message) {
      toast.error('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      const submissionData = {
        eventId: parseInt(formData.eventId),
        title: formData.title,
        message: formData.message,
        priority: formData.priority,
        isImportant: formData.isImportant
      };

      await onSubmit(submissionData);
    } catch (error) {
      // Error handled by parent
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {initialData ? 'Edit Announcement' : 'Create New Announcement'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="eventId">Event *</Label>
            <Select
              value={formData.eventId}
              onValueChange={(value) => setFormData(prev => ({ ...prev, eventId: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select an event" />
              </SelectTrigger>
              <SelectContent>
                {events.map((event) => (
                  <SelectItem key={event.EventID} value={event.EventID.toString()}>
                    {event.Name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Enter announcement title"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Content *</Label>
            <Textarea
              id="message"
              value={formData.message}
              onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
              placeholder="Enter announcement content"
              rows={6}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Select
                value={formData.priority}
                onValueChange={(value: 'low' | 'medium' | 'high') => 
                  setFormData(prev => ({ ...prev, priority: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Options</Label>
              <div className="flex items-center space-x-2 pt-2">
                <Checkbox
                  id="isImportant"
                  checked={formData.isImportant}
                  onCheckedChange={(checked) => 
                    setFormData(prev => ({ ...prev, isImportant: !!checked }))
                  }
                />
                <Label htmlFor="isImportant" className="text-sm">
                  Mark as important
                </Label>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : (initialData ? 'Update' : 'Create')} Announcement
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
