import Link from 'next/link';
import { Calendar, Clock, MapPin, Users, Trophy, Globe, Tag, ChevronRight } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Event } from '@/hooks/useEvents';

interface ParticipantEventCardProps {
  event: Event;
}

export const ParticipantEventCard = ({ event }: ParticipantEventCardProps) => {
  const truncateDescription = (description: string, maxWords: number = 8): string => {
    const words = description.split(' ');
    if (words.length <= maxWords) {
      return description;
    }
    return words.slice(0, maxWords).join(' ') + '...';
  };

  const getFirstPrize = (prizesString: string): number => {
    const firstPrizeMatch = prizesString.match(/1st[:\s]*\$?(\d+(?:,\d+)*)/i);
    if (firstPrizeMatch) {
      return parseInt(firstPrizeMatch[1].replace(/,/g, ''));
    }
    const fallbackMatch = prizesString.match(/\$(\d+(?:,\d+)*)/);
    if (fallbackMatch) {
      return parseInt(fallbackMatch[1].replace(/,/g, ''));
    }
    return 0;
  };

  const getTracks = (tracksString: string): string[] => {
    return tracksString.split(',').map(track => track.trim()).slice(0, 4);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getEventStatus = (event: Event) => {
    const now = new Date();
    const startDate = new Date(event.StartDate);
    const endDate = new Date(event.EndDate);

    if (now < startDate) return 'upcoming';
    if (now >= startDate && now <= endDate) return 'ongoing';
    return 'completed';
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: "default" | "destructive" | "outline" | "secondary" | null | undefined; label: string }> = {
      upcoming: { variant: 'default', label: 'Upcoming' },
      ongoing: { variant: 'destructive', label: 'Live' },
      completed: { variant: 'secondary', label: 'Completed' },
    };
    
    const statusInfo = variants[status] || variants.upcoming;
    return (
      <Badge variant={statusInfo.variant} className="text-xs">
        {statusInfo.label}
      </Badge>
    );
  };

  const status = getEventStatus(event);

  return (
    <Card className="hover:shadow-lg transition-shadow flex flex-col h-full">
      <CardHeader className="space-y-3 pb-4">
        <div className="flex items-start justify-between">
          <div className="space-y-1 flex-1">
            <CardTitle className="text-lg line-clamp-2 min-h-[3.5rem]">
              {event.Name}
            </CardTitle>
            <div className="flex items-center gap-2">
              {getStatusBadge(status)}
              <Badge variant="outline" className="text-xs">
                <Globe className="h-3 w-3 mr-1" />
                {event.Mode}
              </Badge>
            </div>
          </div>
        </div>
        <CardDescription className="line-clamp-2 min-h-[3rem] text-sm">
          {truncateDescription(event.Description)}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col justify-between space-y-4">
        {/* Event Details Section */}
        <div className="space-y-2 text-sm">
          <div className="flex items-center text-muted-foreground">
            <Calendar className="h-4 w-4 mr-2 flex-shrink-0" />
            <span className="truncate">{formatDate(event.StartDate)} - {formatDate(event.EndDate)}</span>
          </div>
          <div className="flex items-center text-muted-foreground">
            <Clock className="h-4 w-4 mr-2 flex-shrink-0" />
            <span>{formatTime(event.StartDate)}</span>
          </div>
          <div className="flex items-center text-muted-foreground">
            <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
            <span>{event.Mode} Event</span>
          </div>
          <div className="flex items-center text-muted-foreground">
            <Users className="h-4 w-4 mr-2 flex-shrink-0" />
            <span>Max team size: {event.MaxTeamSize}</span>
          </div>
        </div>

        {/* Tags Section with Fixed Height */}
        <div className="min-h-[2.5rem] flex items-start">
          {getTracks(event.Tracks).length > 0 ? (
            <div className="flex flex-wrap gap-1">
              {getTracks(event.Tracks).slice(0, 3).map((tag: string, index: number) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  <Tag className="h-3 w-3 mr-1" />
                  {tag}
                </Badge>
              ))}
              {getTracks(event.Tracks).length > 3 && (
                <Badge variant="secondary" className="text-xs">
                  +{getTracks(event.Tracks).length - 3} more
                </Badge>
              )}
            </div>
          ) : (
            <div className="text-xs text-muted-foreground">No tags available</div>
          )}
        </div>

        {/* Bottom Section - Always at bottom */}
        <div className="pt-4 mt-auto border-t border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center text-sm font-medium text-foreground">
              <Trophy className="h-4 w-4 mr-1 text-yellow-500" />
              <span>1st: ${getFirstPrize(event.Prizes).toLocaleString()}</span>
            </div>
            <Button asChild size="sm" className="ml-2">
              <Link href={`/dashboard/events/${event.EventID}`}>
                View Details
                <ChevronRight className="h-4 w-4 ml-1" />
              </Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
