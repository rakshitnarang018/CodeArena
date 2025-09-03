import { Calendar, Clock, Users, MapPin } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface StatsCardData {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: number;
  color: string;
}

interface EventsStatsCardsProps {
  events: any[];
}

export const EventsStatsCards = ({ events }: EventsStatsCardsProps) => {
  const now = new Date();
  
  const stats: StatsCardData[] = [
    {
      icon: Calendar,
      label: 'Total Events',
      value: events.length,
      color: 'text-blue-600',
    },
    {
      icon: Clock,
      label: 'Active Events',
      value: events.filter(e => e.IsActive).length,
      color: 'text-green-600',
    },
    {
      icon: Users,
      label: 'Upcoming',
      value: events.filter(e => new Date(e.StartDate) > now).length,
      color: 'text-purple-600',
    },
    {
      icon: MapPin,
      label: 'Completed',
      value: events.filter(e => new Date(e.EndDate) < now).length,
      color: 'text-orange-600',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {stats.map((stat, index) => {
        const IconComponent = stat.icon;
        return (
          <Card key={index}>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <IconComponent className={`h-4 w-4 ${stat.color}`} />
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
