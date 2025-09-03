'use client';

import { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { apiRequest } from '@/lib/api';
import { Event } from './types';

interface EventEditDialogProps {
  event: Event;
  isOpen: boolean;
  onClose: () => void;
  onEventUpdated: () => void;
}

interface EventFormData {
  name: string;
  description: string;
  theme: string;
  mode: 'Online' | 'Offline';
  startDate: string;
  endDate: string;
  submissionDeadline: string;
  resultDate: string;
  rules: string;
  timeline: string;
  tracks: string;
  prizes: string;
  maxTeamSize: number;
  sponsors: string;
  isActive: boolean;
}

export const EventEditDialog = ({ event, isOpen, onClose, onEventUpdated }: EventEditDialogProps) => {
  const [loading, setLoading] = useState(false);
  
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<EventFormData>({
    defaultValues: {
      name: event.Name || '',
      description: event.Description || '',
      theme: event.Theme || '',
      mode: (event.Mode === 'Hybrid' ? 'Online' : event.Mode) || 'Online',
      startDate: event.StartDate ? new Date(event.StartDate).toISOString().slice(0, 16) : '',
      endDate: event.EndDate ? new Date(event.EndDate).toISOString().slice(0, 16) : '',
      submissionDeadline: event.SubmissionDeadline ? new Date(event.SubmissionDeadline).toISOString().slice(0, 16) : '',
      resultDate: event.ResultDate ? new Date(event.ResultDate).toISOString().slice(0, 16) : '',
      rules: event.Rules || '',
      timeline: event.Timeline || '',
      tracks: event.Tracks || '',
      prizes: event.Prizes || '',
      maxTeamSize: event.MaxTeamSize || 1,
      sponsors: event.Sponsors || '',
      isActive: event.IsActive || false,
    }
  });

  const watchedIsActive = watch('isActive');

  const onSubmit: SubmitHandler<EventFormData> = async (data) => {
    setLoading(true);
    try {
      await apiRequest(`/events/update/${event.EventID}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: data.name,
          description: data.description,
          theme: data.theme,
          mode: data.mode,
          startDate: new Date(data.startDate).toISOString(),
          endDate: new Date(data.endDate).toISOString(),
          submissionDeadline: new Date(data.submissionDeadline).toISOString(),
          resultDate: new Date(data.resultDate).toISOString(),
          rules: data.rules,
          timeline: data.timeline,
          tracks: data.tracks,
          prizes: data.prizes,
          maxTeamSize: data.maxTeamSize,
          sponsors: data.sponsors,
          isActive: data.isActive,
        }),
      });

      toast('Event updated successfully!');

      onEventUpdated();
    } catch (error) {
      console.error('Error updating event:', error);
      toast('Failed to update event. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Event</DialogTitle>
          <DialogDescription>
            Update the event details below. All fields are required unless marked optional.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Basic Information */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Event Name</Label>
                <Input
                  id="name"
                  {...register('name', { required: 'Event name is required' })}
                  placeholder="Enter event name"
                />
                {errors.name && (
                  <p className="text-sm text-red-600">{errors.name.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="theme">Theme</Label>
                <Input
                  id="theme"
                  {...register('theme', { required: 'Theme is required' })}
                  placeholder="e.g., Web Development, AI/ML"
                />
                {errors.theme && (
                  <p className="text-sm text-red-600">{errors.theme.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="mode">Mode</Label>
                <Select
                  value={watch('mode')}
                  onValueChange={(value) => setValue('mode', value as 'Online' | 'Offline')}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select mode" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Online">Online</SelectItem>
                    <SelectItem value="Offline">Offline</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="maxTeamSize">Max Team Size</Label>
                <Input
                  id="maxTeamSize"
                  type="number"
                  min="1"
                  {...register('maxTeamSize', { 
                    required: 'Max team size is required',
                    min: { value: 1, message: 'Team size must be at least 1' }
                  })}
                />
                {errors.maxTeamSize && (
                  <p className="text-sm text-red-600">{errors.maxTeamSize.message}</p>
                )}
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="isActive"
                  checked={watchedIsActive}
                  onCheckedChange={(checked) => setValue('isActive', checked)}
                />
                <Label htmlFor="isActive">Event Active</Label>
              </div>
            </div>

            {/* Dates */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="startDate">Start Date & Time</Label>
                <Input
                  id="startDate"
                  type="datetime-local"
                  {...register('startDate', { required: 'Start date is required' })}
                />
                {errors.startDate && (
                  <p className="text-sm text-red-600">{errors.startDate.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="endDate">End Date & Time</Label>
                <Input
                  id="endDate"
                  type="datetime-local"
                  {...register('endDate', { required: 'End date is required' })}
                />
                {errors.endDate && (
                  <p className="text-sm text-red-600">{errors.endDate.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="submissionDeadline">Submission Deadline</Label>
                <Input
                  id="submissionDeadline"
                  type="datetime-local"
                  {...register('submissionDeadline', { required: 'Submission deadline is required' })}
                />
                {errors.submissionDeadline && (
                  <p className="text-sm text-red-600">{errors.submissionDeadline.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="resultDate">Result Date</Label>
                <Input
                  id="resultDate"
                  type="datetime-local"
                  {...register('resultDate', { required: 'Result date is required' })}
                />
                {errors.resultDate && (
                  <p className="text-sm text-red-600">{errors.resultDate.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Full Width Fields */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                {...register('description', { required: 'Description is required' })}
                placeholder="Describe your event..."
                rows={4}
              />
              {errors.description && (
                <p className="text-sm text-red-600">{errors.description.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="rules">Rules</Label>
              <Textarea
                id="rules"
                {...register('rules')}
                placeholder="Event rules and guidelines..."
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="timeline">Timeline</Label>
              <Textarea
                id="timeline"
                {...register('timeline')}
                placeholder="Event timeline and schedule..."
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="tracks">Tracks</Label>
              <Textarea
                id="tracks"
                {...register('tracks')}
                placeholder="Available tracks or categories..."
                rows={2}
              />
            </div>

            <div>
              <Label htmlFor="prizes">Prizes</Label>
              <Textarea
                id="prizes"
                {...register('prizes')}
                placeholder="Prize details..."
                rows={2}
              />
            </div>

            <div>
              <Label htmlFor="sponsors">Sponsors</Label>
              <Textarea
                id="sponsors"
                {...register('sponsors')}
                placeholder="Sponsor information..."
                rows={2}
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Updating...' : 'Update Event'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
