import Link from 'next/link';
import { Calendar, MapPin, MoreHorizontal, Edit, Trash2, Eye, Settings, Award } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { format } from 'date-fns';

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

interface OrganizerEventCardProps {
  event: OrganizerEvent;
  onEdit?: (eventId: number) => void;
  onDelete?: (eventId: number) => void;
  onManage?: (eventId: number) => void;
}

export const OrganizerEventCard = ({ event, onEdit, onDelete, onManage }: OrganizerEventCardProps) => {
  const getEventStatus = (event: OrganizerEvent) => {
    const now = new Date();
    const startDate = new Date(event.StartDate);
    const endDate = new Date(event.EndDate);
    
    if (!event.IsActive) return { status: 'inactive', color: 'bg-gray-100 text-gray-800' };
    if (startDate > now) return { status: 'upcoming', color: 'bg-blue-100 text-blue-800' };
    if (endDate < now) return { status: 'completed', color: 'bg-gray-100 text-gray-800' };
    return { status: 'ongoing', color: 'bg-green-100 text-green-800' };
  };

  const { status, color } = getEventStatus(event);

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1 flex-1">
            <CardTitle className="line-clamp-2 text-lg">
              {event.Name}
            </CardTitle>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className={color}>
                {status}
              </Badge>
              <Badge variant="outline">
                {event.Mode}
              </Badge>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link href={`/dashboard/events/${event.EventID}`}>
                  <Eye className="h-4 w-4 mr-2" />
                  View Details
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onEdit?.(event.EventID)}>
                <Edit className="h-4 w-4 mr-2" />
                Edit Event
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onManage?.(event.EventID)}>
                <Settings className="h-4 w-4 mr-2" />
                Manage
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={`/certificates?eventId=${event.EventID}`}>
                  <Award className="h-4 w-4 mr-2" />
                  Generate Certificates
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="text-red-600"
                onClick={() => onDelete?.(event.EventID)}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <CardDescription className="line-clamp-3 mb-4">
          {event.Description}
        </CardDescription>
        
        <div className="space-y-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Calendar className="h-3 w-3" />
            <span>
              {format(new Date(event.StartDate), 'MMM dd, yyyy')} - {format(new Date(event.EndDate), 'MMM dd, yyyy')}
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            <MapPin className="h-3 w-3" />
            <span>{event.Mode}</span>
          </div>
          
          {event.Theme && (
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 bg-primary rounded-full"></span>
              <span>{event.Theme}</span>
            </div>
          )}
        </div>
        
        <div className="flex items-center justify-between mt-4 pt-4 border-t">
          <div className="text-sm">
            <span className="text-muted-foreground">Registrations: </span>
            <span className="font-medium">
              {Math.floor(Math.random() * 100) + 10}
            </span>
          </div>
          <Link href={`/dashboard/events/${event.EventID}`}>
            <Button variant="outline" size="sm">
              <Eye className="h-3 w-3 mr-1" />
              View
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};
