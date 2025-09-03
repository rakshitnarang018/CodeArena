import Link from 'next/link';
import { Calendar, Plus } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { OrganizerEventCard } from './OrganizerEventCard';

interface OrganizerEvent {
  EventID: number;
  Name: string;
  Description: string;
  Theme: string;
  Mode: "Online" | "Offline" | "Hybrid";
  StartDate: string;
  EndDate: string;
  IsActive: boolean;
}

interface OrganizerEventsGridProps {
  events: OrganizerEvent[];
  searchTerm: string;
  onEdit?: (eventId: number) => void;
  onDelete?: (eventId: number) => void;
  onManage?: (eventId: number) => void;
}

export const OrganizerEventsGrid = ({ 
  events, 
  searchTerm, 
  onEdit, 
  onDelete, 
  onManage 
}: OrganizerEventsGridProps) => {
  if (events.length === 0) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <Calendar className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
          <h3 className="text-lg font-semibold mb-2">No events found</h3>
          <p className="text-muted-foreground mb-4">
            {searchTerm ? 'No events match your search criteria.' : 'You haven\'t created any events yet.'}
          </p>
          {!searchTerm && (
            <Link href="/dashboard/events/create">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Event
              </Button>
            </Link>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {events.map((event) => (
        <OrganizerEventCard
          key={event.EventID}
          event={event}
          onEdit={onEdit}
          onDelete={onDelete}
          onManage={onManage}
        />
      ))}
    </div>
  );
};
