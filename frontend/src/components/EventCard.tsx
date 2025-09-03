import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Event } from '@/contexts/EventContext';
import {
  Calendar,
  Clock,
  Users,
  Trophy,
  MapPin,
  Star,
  ArrowRight,
  Zap,
} from 'lucide-react';
import Link from 'next/link';
import { formatDistanceToNow, format } from 'date-fns';

interface EventCardProps {
  event: Event;
  size?: 'default' | 'large';
  showOrganizer?: boolean;
}

const EventCard = ({ event, size = 'default', showOrganizer = true }: EventCardProps) => {
  const isLarge = size === 'large';
  
  const getStatusColor = (status: Event['status']) => {
    switch (status) {
      case 'upcoming':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'ongoing':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'completed':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getDifficultyColor = (difficulty: Event['difficulty']) => {
    switch (difficulty) {
      case 'beginner':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'advanced':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryIcon = (category: Event['category']) => {
    switch (category) {
      case 'hackathon':
        return <Zap className="h-4 w-4" />;
      case 'competition':
        return <Trophy className="h-4 w-4" />;
      case 'workshop':
        return <Star className="h-4 w-4" />;
      case 'conference':
        return <Users className="h-4 w-4" />;
      default:
        return <Calendar className="h-4 w-4" />;
    }
  };

  return (
    <Card className={`overflow-hidden card-hover group ${isLarge ? 'h-auto' : 'h-full'}`}>
      {/* Event Image */}
      <div className="relative">
        <img
          src={event.image}
          alt={event.title}
          className={`w-full object-cover ${isLarge ? 'h-64' : 'h-48'} group-hover:scale-105 transition-smooth`}
        />
        <div className="absolute top-3 left-3 flex space-x-2">
          <Badge className={getStatusColor(event.status)}>
            {event.status}
          </Badge>
          <Badge className={getDifficultyColor(event.difficulty)}>
            {event.difficulty}
          </Badge>
        </div>
        <div className="absolute top-3 right-3">
          <Badge variant="secondary" className="bg-white/90 text-gray-800">
            <div className="flex items-center space-x-1">
              {getCategoryIcon(event.category)}
              <span className="capitalize">{event.category}</span>
            </div>
          </Badge>
        </div>
      </div>

      <CardHeader className={isLarge ? 'pb-3' : 'pb-2'}>
        <div className="flex items-start justify-between">
          <CardTitle className={`line-clamp-2 group-hover:text-primary transition-fast ${isLarge ? 'text-xl' : 'text-lg'}`}>
            {event.title}
          </CardTitle>
        </div>
        
        {showOrganizer && (
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Avatar className="h-6 w-6">
              <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${event.organizer}`} />
              <AvatarFallback>{event.organizer[0]}</AvatarFallback>
            </Avatar>
            <span>by {event.organizer}</span>
          </div>
        )}
      </CardHeader>

      <CardContent className={isLarge ? 'pt-0' : 'pt-0 pb-4'}>
        <p className={`text-muted-foreground mb-4 line-clamp-2 ${isLarge ? 'text-base' : 'text-sm'}`}>
          {event.description}
        </p>

        {/* Event Details */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>{format(new Date(event.eventStart), 'MMM dd, yyyy')}</span>
            <span>-</span>
            <span>{format(new Date(event.eventEnd), 'MMM dd, yyyy')}</span>
          </div>
          
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>
              {event.status === 'upcoming'
                ? `Starts ${formatDistanceToNow(new Date(event.eventStart), { addSuffix: true })}`
                : event.status === 'ongoing'
                ? `Ends ${formatDistanceToNow(new Date(event.eventEnd), { addSuffix: true })}`
                : 'Event completed'}
            </span>
          </div>

          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Users className="h-4 w-4" />
            <span>
              {event.registrationCount} registered
              {event.maxRegistrations && ` / ${event.maxRegistrations} max`}
            </span>
          </div>

          {event.prizes.length > 0 && (
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Trophy className="h-4 w-4" />
              <span className="truncate">{event.prizes[0]}</span>
              {event.prizes.length > 1 && (
                <span className="text-xs">+{event.prizes.length - 1} more</span>
              )}
            </div>
          )}
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1 mb-4">
          {event.tags.slice(0, isLarge ? 6 : 4).map((tag) => (
            <Badge key={tag} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
          {event.tags.length > (isLarge ? 6 : 4) && (
            <Badge variant="outline" className="text-xs">
              +{event.tags.length - (isLarge ? 6 : 4)}
            </Badge>
          )}
        </div>

        {/* Action Button */}
        <Button asChild className="w-full group">
          <Link href="/competitions">
            <span>View Details</span>
            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
};

export default EventCard;
