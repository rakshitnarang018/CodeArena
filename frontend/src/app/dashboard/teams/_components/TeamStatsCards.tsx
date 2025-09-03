import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TeamStats } from '@/hooks/useTeams';
import { Users, Trophy, Crown, Calendar } from 'lucide-react';

interface TeamStatsCardsProps {
  stats: TeamStats | null;
  loading: boolean;
}

export const TeamStatsCards: React.FC<TeamStatsCardsProps> = ({ stats, loading }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[...Array(4)].map((_, i) => (
          <Card key={`loading-card-${i}`} className="animate-pulse">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                <div className="h-4 bg-muted rounded w-20"></div>
              </CardTitle>
              <div className="h-4 w-4 bg-muted rounded"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-muted rounded w-16 mb-1"></div>
              <div className="h-3 bg-muted rounded w-24"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const cards = [
    {
      title: 'Total Teams',
      value: stats?.totalTeams || 0,
      description: 'All teams you\'re part of',
      icon: Users,
      color: 'text-blue-600'
    },
    {
      title: 'Teams as Leader',
      value: stats?.teamsAsLeader || 0,
      description: 'Teams you lead',
      icon: Crown,
      color: 'text-orange-600'
    },
    {
      title: 'Teams as Member',
      value: stats?.teamsAsMember || 0,
      description: 'Teams you\'re a member of',
      icon: Trophy,
      color: 'text-green-600'
    },
    {
      title: 'Events',
      value: stats?.totalEvents || 0,
      description: 'Different events',
      icon: Calendar,
      color: 'text-purple-600'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {card.title}
              </CardTitle>
              <Icon className={`h-4 w-4 ${card.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{card.value}</div>
              <p className="text-xs text-muted-foreground">
                {card.description}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
