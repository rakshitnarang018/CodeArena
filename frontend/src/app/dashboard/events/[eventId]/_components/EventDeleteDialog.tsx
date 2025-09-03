'use client';

import { useState } from 'react';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';
import { apiRequest } from '@/lib/api';
import { Event } from './types';

interface EventDeleteDialogProps {
  event: Event;
  isOpen: boolean;
  onClose: () => void;
  onEventDeleted: () => void;
}

export const EventDeleteDialog = ({ event, isOpen, onClose, onEventDeleted }: EventDeleteDialogProps) => {
  const [loading, setLoading] = useState(false);
  const [confirmText, setConfirmText] = useState('');
  const [error, setError] = useState<string | null>(null);

  const isConfirmValid = confirmText === event.Name;

  const handleDelete = async () => {
    if (!isConfirmValid) return;

    setLoading(true);
    setError(null);
    
    try {
      await apiRequest(`/events/delete/${event.EventID}`, {
        method: 'DELETE',
      });

      onEventDeleted();
    } catch (err) {
      console.error('Error deleting event:', err);
      setError(err instanceof Error ? err.message : 'Failed to delete event');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setConfirmText('');
    setError(null);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="h-5 w-5" />
            Delete Event
          </DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete the event and all associated data.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <Alert className="border-red-200 bg-red-50">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              <strong>Warning:</strong> Deleting this event will also remove:
              <ul className="mt-2 ml-4 list-disc text-sm">
                <li>All participant enrollments</li>
                <li>All team registrations</li>
                <li>All submissions</li>
                <li>All announcements</li>
                <li>All chat messages</li>
              </ul>
            </AlertDescription>
          </Alert>

          <div>
            <Label htmlFor="confirmText" className="text-sm font-medium">
              To confirm, type <strong>"{event.Name}"</strong> below:
            </Label>
            <Input
              id="confirmText"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder={event.Name}
              className="mt-1"
            />
          </div>

          {error && (
            <Alert className="border-red-200 bg-red-50">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">
                {error}
              </AlertDescription>
            </Alert>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={loading}>
            Cancel
          </Button>
          <Button 
            variant="destructive" 
            onClick={handleDelete}
            disabled={!isConfirmValid || loading}
          >
            {loading ? 'Deleting...' : 'Delete Event'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
