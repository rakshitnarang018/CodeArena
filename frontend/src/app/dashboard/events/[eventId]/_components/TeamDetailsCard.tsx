'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  Users, 
  Crown, 
  Phone, 
  Mail, 
  Calendar,
  UserPlus,
  Settings,
  Copy,
  Check
} from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { apiRequest } from '@/lib/api';

interface TeamMember {
  userid: number;
  name: string;
  email: string;
  Role: string;
}

interface Team {
  TeamId: number;
  TeamName: string;
  EventId: number;
  CreatedAt: string;
  members: TeamMember[];
}

interface TeamDetailsCardProps {
  eventId: number;
  eventName: string;
  maxTeamSize: number;
  onLeaveTeam: () => void;
}

export const TeamDetailsCard = ({ eventId, eventName, maxTeamSize, onLeaveTeam }: TeamDetailsCardProps) => {
  const { user } = useAuth();
  const [team, setTeam] = useState<Team | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetchTeamDetails();
  }, [eventId]);

  const fetchTeamDetails = async () => {
    try {
      const response = await apiRequest<{ data: Team[] }>('/teams/my-teams', {
        method: 'GET'
      });
      
      // Find team for this event
      const eventTeam = response.data?.find(t => t.EventId === eventId);
      setTeam(eventTeam || null);
    } catch (error) {
      console.error('Error fetching team details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInviteTeam = () => {
    if (!team) return;
    
    const inviteLink = `${window.location.origin}/teams/${team.TeamId}/join`;
    navigator.clipboard.writeText(inviteLink);
    setCopied(true);
    toast('Invite link copied to clipboard!');
    
    setTimeout(() => setCopied(false), 2000);
  };

  const handleLeaveTeam = async () => {
    if (!team) return;
    
    try {
      await apiRequest(`/teams/${team.TeamId}/leave`, {
        method: 'POST'
      });
      
      toast('Left team successfully');
      onLeaveTeam();
    } catch (error) {
      console.error('Error leaving team:', error);
      toast('Failed to leave team');
    }
  };

  const isLeader = team?.members?.some(member => 
    member?.userid && user?.id && member.userid.toString() === user.id && member.Role === 'Leader'
  );

  if (loading) {
    return (
      <Card className="card-optimized">
        <CardContent className="p-4">
          <div className="animate-pulse space-y-3">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!team) {
    return null;
  }

  return (
    <Card className="card-optimized">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          My Team
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Team Header */}
        <div className="space-y-2">
          <h3 className="font-semibold text-lg">{team.TeamName}</h3>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            Created {new Date(team.CreatedAt).toLocaleDateString()}
          </div>
          <Badge variant="outline" className="w-fit">
            {team.members?.length || 0}/{maxTeamSize} Members
          </Badge>
        </div>

        {/* Team Members */}
        <div className="space-y-3">
          <h4 className="font-medium text-sm">Team Members</h4>
          {team.members?.map((member, index) => (
            <div key={member?.userid || `team-member-${index}`} className="flex items-center gap-3 p-3 bg-accent/30 rounded-lg">
              <Avatar className="w-10 h-10">
                <AvatarFallback>
                  {member?.name ? member.name.charAt(0).toUpperCase() : 'U'}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-medium truncate">{member?.name || 'Unknown User'}</p>
                  {member.Role === 'Leader' && (
                    <Badge variant="secondary" className="text-xs">
                      <Crown className="h-3 w-3 mr-1" />
                      Leader
                    </Badge>
                  )}
                  {member?.userid && user?.id && member.userid.toString() === user.id && (
                    <Badge variant="outline" className="text-xs">
                      You
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground truncate">
                  {member?.email || 'No email provided'}
                </p>
              </div>
              <div className="text-green-600">
                <Check className="h-4 w-4" />
              </div>
            </div>
          )) || []}
        </div>

        {/* Team Actions */}
        <div className="space-y-2 pt-2 border-t">
          {isLeader && team.members && team.members.length < maxTeamSize && (
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full gap-2"
              onClick={handleInviteTeam}
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4" />
                  Copied!
                </>
              ) : (
                <>
                  <UserPlus className="h-4 w-4" />
                  Invite Members
                </>
              )}
            </Button>
          )}
          
          {isLeader && (
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full gap-2"
            >
              <Settings className="h-4 w-4" />
              Team Settings
            </Button>
          )}
          
          <Button 
            variant="ghost" 
            size="sm" 
            className="w-full text-red-600 hover:text-red-700 hover:bg-red-50"
            onClick={handleLeaveTeam}
          >
            Leave Team
          </Button>
        </div>

        {/* Team Status */}
        <div className="bg-green-50 p-3 rounded-lg">
          <div className="flex items-center gap-2">
            <Check className="h-4 w-4 text-green-600" />
            <span className="text-sm font-medium text-green-900">
              Enrolled in {eventName}
            </span>
          </div>
          <p className="text-xs text-green-700 mt-1">
            Your team is registered and ready to participate
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
