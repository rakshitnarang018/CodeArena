import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useOrganizerData } from '@/hooks/useOrganizerData';
import { Team } from '@/hooks/useTeams';
import { Loader2 } from 'lucide-react';

interface CreateTeamDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (teamData: {
    teamName: string;
    eventId: number;
    description?: string;
    maxMembers?: number;
  }) => Promise<{ success: boolean; error?: string }>;
}

interface EditTeamDialogProps {
  open: boolean;
  onClose: () => void;
  team: Team | null;
  onSubmit: (teamId: number, updateData: {
    teamName?: string;
    description?: string;
    maxMembers?: number;
  }) => Promise<{ success: boolean; error?: string }>;
}

export const CreateTeamDialog: React.FC<CreateTeamDialogProps> = ({
  open,
  onClose,
  onSubmit
}) => {
  const [formData, setFormData] = useState({
    teamName: '',
    eventId: '',
    description: '',
    maxMembers: '4'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { myEvents } = useOrganizerData();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.teamName.trim() || !formData.eventId) {
      setError('Team name and event are required');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await onSubmit({
        teamName: formData.teamName.trim(),
        eventId: parseInt(formData.eventId),
        description: formData.description.trim() || undefined,
        maxMembers: parseInt(formData.maxMembers) || undefined
      });

      if (result.success) {
        handleClose();
      } else {
        setError(result.error || 'Failed to create team');
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      teamName: '',
      eventId: '',
      description: '',
      maxMembers: '4'
    });
    setError(null);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Team</DialogTitle>
          <DialogDescription>
            Create a new team for an event. You'll be the team leader.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="teamName">Team Name *</Label>
            <Input
              id="teamName"
              placeholder="Enter team name"
              value={formData.teamName}
              onChange={(e) => setFormData(prev => ({ ...prev, teamName: e.target.value }))}
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="eventId">Event *</Label>
            <Select
              value={formData.eventId}
              onValueChange={(value) => setFormData(prev => ({ ...prev, eventId: value }))}
              disabled={loading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select an event" />
              </SelectTrigger>
              <SelectContent>
                {myEvents.map((event) => (
                  <SelectItem key={event.EventID} value={event.EventID.toString()}>
                    {event.Name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="maxMembers">Maximum Members</Label>
            <Select
              value={formData.maxMembers}
              onValueChange={(value) => setFormData(prev => ({ ...prev, maxMembers: value }))}
              disabled={loading}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[2, 3, 4, 5, 6, 8, 10].map((num) => (
                  <SelectItem key={num} value={num.toString()}>
                    {num} members
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              placeholder="Brief description of your team goals..."
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              disabled={loading}
              rows={3}
            />
          </div>

          {error && (
            <div className="text-sm text-red-600 bg-red-50 p-2 rounded">
              {error}
            </div>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Create Team
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export const EditTeamDialog: React.FC<EditTeamDialogProps> = ({
  open,
  onClose,
  team,
  onSubmit
}) => {
  const [formData, setFormData] = useState({
    teamName: '',
    description: '',
    maxMembers: '4'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  React.useEffect(() => {
    if (team) {
      setFormData({
        teamName: team.TeamName,
        description: team.Description || '',
        maxMembers: team.MaxMembers.toString()
      });
    }
  }, [team]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!team || !formData.teamName.trim()) {
      setError('Team name is required');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await onSubmit(team.TeamId, {
        teamName: formData.teamName.trim(),
        description: formData.description.trim() || undefined,
        maxMembers: parseInt(formData.maxMembers)
      });

      if (result.success) {
        handleClose();
      } else {
        setError(result.error || 'Failed to update team');
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setError(null);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Team</DialogTitle>
          <DialogDescription>
            Update your team information.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="teamName">Team Name *</Label>
            <Input
              id="teamName"
              placeholder="Enter team name"
              value={formData.teamName}
              onChange={(e) => setFormData(prev => ({ ...prev, teamName: e.target.value }))}
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="maxMembers">Maximum Members</Label>
            <Select
              value={formData.maxMembers}
              onValueChange={(value) => setFormData(prev => ({ ...prev, maxMembers: value }))}
              disabled={loading}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[2, 3, 4, 5, 6, 8, 10].map((num) => (
                  <SelectItem key={num} value={num.toString()}>
                    {num} members
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Brief description of your team goals..."
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              disabled={loading}
              rows={3}
            />
          </div>

          {error && (
            <div className="text-sm text-red-600 bg-red-50 p-2 rounded">
              {error}
            </div>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Update Team
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
