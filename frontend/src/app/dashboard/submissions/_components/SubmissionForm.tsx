'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { X, Plus, Upload, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';
import { apiRequest } from '@/lib/api';

interface Event {
  EventID: number; // Match backend field name
  Name: string;    // Match backend field name
  IsActive: boolean;  // Match backend field name (bit field)
}

interface Team {
  TeamId: number;  // Use TeamId to match API response
  TeamName: string; // Use TeamName to match API response
  EventId: number; // Use capital E to match API response
}

interface Submission {
  _id?: string;
  eventId: number;
  teamId: number;
  title: string;
  description: string;
  track: string;
  githubUrl?: string;
  videoUrl?: string;
  docs: string[];
  round: number;
}

interface SubmissionFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<Submission, '_id'>) => void;
  initialData?: Submission;
  prefilledData?: { eventId?: number; teamId?: number };
}

export default function SubmissionForm({ isOpen, onClose, onSubmit, initialData, prefilledData }: SubmissionFormProps) {
  const [events, setEvents] = useState<Event[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState<{[key: string]: string}>({});
  
  const [formData, setFormData] = useState({
    eventId: '',
    teamId: '',
    title: '',
    description: '',
    track: '',
    githubUrl: '',
    videoUrl: '',
    docs: [] as string[],
    round: 1
  });

  useEffect(() => {
    if (isOpen) {
      fetchEvents();
      fetchMyTeams();
      
      if (initialData) {
        setFormData({
          eventId: initialData.eventId.toString(),
          teamId: initialData.teamId.toString(),
          title: initialData.title,
          description: initialData.description,
          track: initialData.track,
          githubUrl: initialData.githubUrl || '',
          videoUrl: initialData.videoUrl || '',
          docs: initialData.docs,
          round: initialData.round
        });
      } else if (prefilledData) {
        console.log('PrefilledData:', prefilledData); // Debug log
        setFormData(prev => ({
          ...prev,
          eventId: prefilledData.eventId?.toString() || '',
          teamId: prefilledData.teamId?.toString() || ''
        }));
      }
    }
  }, [isOpen, initialData, prefilledData]);

  useEffect(() => {
    if (formData.eventId) {
      const event = events.find(e => e.EventID.toString() === formData.eventId);
      setSelectedEvent(event || null);
    }
  }, [formData.eventId, events]);

  const fetchEvents = async () => {
    try {
      const response = await apiRequest<{ data: Event[] }>('/events');
      const activeEvents = (response.data || []).filter(event => 
        event.IsActive // Use IsActive instead of Status
      );
      setEvents(activeEvents);
    } catch (error) {
      console.error('Error fetching events:', error);
      toast.error('Failed to fetch events');
    }
  };

  const fetchMyTeams = async () => {
    try {
      const response = await apiRequest<{ data: Team[] }>('/teams/my-teams');
      setTeams(response.data || []);
    } catch (error) {
      console.error('Error fetching teams:', error);
      toast.error('Failed to fetch teams');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Clear previous validation errors
    setValidationErrors({});
    
    // Validate all fields
    const errors: {[key: string]: string} = {};
    Object.keys(formData).forEach(field => {
      const error = validateField(field, formData[field as keyof typeof formData] as string);
      if (error) {
        errors[field] = error;
      }
    });

    // Check required fields
    if (!formData.eventId) errors.eventId = 'Event is required';
    if (!formData.teamId) errors.teamId = 'Team is required';
    if (!formData.title) errors.title = 'Title is required';
    if (!formData.description) errors.description = 'Description is required';
    if (!formData.track) errors.track = 'Track is required';

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      toast.error('Please fix the validation errors before submitting');
      return;
    }

    setLoading(true);
    try {
      const submissionData = {
        eventId: parseInt(formData.eventId),
        teamId: parseInt(formData.teamId),
        title: formData.title,
        description: formData.description,
        track: formData.track,
        githubUrl: formData.githubUrl || undefined,
        videoUrl: formData.videoUrl || undefined,
        docs: formData.docs,
        round: formData.round
      };

      await onSubmit(submissionData);
      
      // Reset form
      setFormData({
        eventId: '',
        teamId: '',
        title: '',
        description: '',
        track: '',
        githubUrl: '',
        videoUrl: '',
        docs: [],
        round: 1
      });
      setValidationErrors({});
    } catch (error: any) {
      // Handle backend validation errors
      if (error?.errors && Array.isArray(error.errors)) {
        const backendErrors: {[key: string]: string} = {};
        error.errors.forEach((err: {field: string, message: string}) => {
          backendErrors[err.field] = err.message;
        });
        setValidationErrors(backendErrors);
        toast.error('Please fix the validation errors');
      } else {
        toast.error(error?.message || 'Failed to submit');
      }
    } finally {
      setLoading(false);
    }
  };

  const addDocUrl = () => {
    const url = prompt('Enter document URL:');
    if (url) {
      setFormData(prev => ({
        ...prev,
        docs: [...prev.docs, url]
      }));
    }
  };

  const removeDocUrl = (index: number) => {
    setFormData(prev => ({
      ...prev,
      docs: prev.docs.filter((_, i) => i !== index)
    }));
  };

  const availableTeams = teams.filter(team => 
    team && team.TeamId && team.EventId && (
      !formData.eventId || team.EventId.toString() === formData.eventId
    )
  );

  // Validation helpers
  const getWordCount = (text: string) => {
    return text.trim().split(/\s+/).filter(word => word.length > 0).length;
  };

  const validateField = (field: string, value: string) => {
    switch (field) {
      case 'title':
        if (value.length < 3) return 'Title must be at least 3 characters long';
        if (value.length > 200) return 'Title cannot exceed 200 characters';
        break;
      case 'description':
        const wordCount = getWordCount(value);
        if (wordCount < 10) return `Description must be at least 10 words long (currently ${wordCount} words)`;
        if (value.length > 2000) return 'Description cannot exceed 2000 characters';
        break;
      case 'track':
        if (value.length < 2) return 'Track must be at least 2 characters long';
        if (value.length > 100) return 'Track cannot exceed 100 characters';
        break;
      case 'githubUrl':
        if (value && !value.match(/^https?:\/\/.+/)) return 'GitHub URL must be a valid URL';
        break;
      case 'videoUrl':
        if (value && !value.match(/^https?:\/\/.+/)) return 'Video URL must be a valid URL';
        break;
    }
    return '';
  };

  const handleFieldChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear previous validation error for this field
    if (validationErrors[field]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }

    // Validate field in real-time
    const error = validateField(field, value);
    if (error) {
      setValidationErrors(prev => ({ ...prev, [field]: error }));
    }
  };

  const isFormValid = () => {
    const requiredFields = ['eventId', 'teamId', 'title', 'description', 'track'];
    const hasRequiredFields = requiredFields.every(field => formData[field as keyof typeof formData]);
    const hasNoValidationErrors = Object.keys(validationErrors).length === 0;
    const titleValid = formData.title.length >= 3;
    const descriptionValid = getWordCount(formData.description) >= 10;
    const trackValid = formData.track.length >= 2;
    
    return hasRequiredFields && hasNoValidationErrors && titleValid && descriptionValid && trackValid;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {initialData ? 'Edit Submission' : 'Create New Submission'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="eventId">Event *</Label>
              <Select
                value={formData.eventId}
                onValueChange={(value) => setFormData(prev => ({ ...prev, eventId: value, teamId: '' }))}
                disabled={!!prefilledData?.eventId}
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
              <Label htmlFor="teamId">Team *</Label>
              {prefilledData?.teamId ? (
                <div className="flex items-center space-x-2">
                  <Input
                    value={availableTeams.find(t => t.TeamId.toString() === formData.teamId)?.TeamName || 'Selected Team'}
                    disabled
                    className="bg-muted"
                  />
                  <Badge variant="secondary">Pre-selected</Badge>
                </div>
              ) : (
                <Select
                  value={formData.teamId}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, teamId: value }))}
                  disabled={!formData.eventId}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a team" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableTeams.filter(team => team && team.TeamId && team.TeamName).map((team) => (
                      <SelectItem key={team.TeamId} value={team.TeamId.toString()}>
                        {team.TeamName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="title">Project Title *</Label>
              <span className="text-xs text-muted-foreground">
                {formData.title.length}/200 characters
              </span>
            </div>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleFieldChange('title', e.target.value)}
              placeholder="Enter your project title (minimum 3 characters)"
              required
              className={validationErrors.title ? 'border-red-500' : ''}
            />
            {validationErrors.title && (
              <p className="text-sm text-red-500">{validationErrors.title}</p>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="track">Track *</Label>
              <span className="text-xs text-muted-foreground">
                {formData.track.length}/100 characters
              </span>
            </div>
            <Input
              id="track"
              value={formData.track}
              onChange={(e) => handleFieldChange('track', e.target.value)}
              placeholder="Enter project track (e.g., AI/ML, Web Development, etc.)"
              required
              className={validationErrors.track ? 'border-red-500' : ''}
            />
            {validationErrors.track && (
              <p className="text-sm text-red-500">{validationErrors.track}</p>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="description">Description *</Label>
              <span className="text-xs text-muted-foreground">
                {getWordCount(formData.description)}/10 words minimum
              </span>
            </div>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleFieldChange('description', e.target.value)}
              placeholder="Describe your project in detail (minimum 10 words)..."
              rows={4}
              required
              className={validationErrors.description ? 'border-red-500' : ''}
            />
            {validationErrors.description && (
              <p className="text-sm text-red-500">{validationErrors.description}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="githubUrl">GitHub Repository</Label>
              <Input
                id="githubUrl"
                type="url"
                value={formData.githubUrl}
                onChange={(e) => handleFieldChange('githubUrl', e.target.value)}
                placeholder="https://github.com/..."
                className={validationErrors.githubUrl ? 'border-red-500' : ''}
              />
              {validationErrors.githubUrl && (
                <p className="text-sm text-red-500">{validationErrors.githubUrl}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="videoUrl">Demo Video</Label>
              <Input
                id="videoUrl"
                type="url"
                value={formData.videoUrl}
                onChange={(e) => handleFieldChange('videoUrl', e.target.value)}
                placeholder="https://youtube.com/..."
                className={validationErrors.videoUrl ? 'border-red-500' : ''}
              />
              {validationErrors.videoUrl && (
                <p className="text-sm text-red-500">{validationErrors.videoUrl}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Documents</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addDocUrl}
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Document
              </Button>
            </div>
            {formData.docs.length > 0 && (
              <div className="space-y-2">
                {formData.docs.map((doc, index) => (
                  <div key={index} className="flex items-center gap-2 p-2 bg-muted rounded">
                    <ExternalLink className="h-4 w-4" />
                    <span className="flex-1 text-sm truncate">{doc}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeDocUrl(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={loading || !isFormValid()}
              className={!isFormValid() ? 'opacity-50 cursor-not-allowed' : ''}
            >
              {loading ? 'Saving...' : (initialData ? 'Update' : 'Create')} Submission
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
