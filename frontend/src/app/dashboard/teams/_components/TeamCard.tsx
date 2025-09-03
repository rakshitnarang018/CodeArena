import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Team } from '@/hooks/useTeams';
import { 
  Users, 
  Calendar, 
  Crown, 
  MoreVertical, 
  Edit, 
  Trash2, 
  UserMinus,
  ExternalLink,
  Copy
} from 'lucide-react';
import { format } from 'date-fns';
import { useAuth } from '@/contexts/AuthContext';

interface TeamCardProps {
  team: Team;
  onEdit?: (team: Team) => void;
  onDelete?: (teamId: number) => void;
  onLeave?: (teamId: number) => void;
  onRemoveMember?: (teamId: number, memberId: number) => void;
  onViewDetails?: (teamId: number) => void;
}

export const TeamCard: React.FC<TeamCardProps> = ({
  team,
  onEdit,
  onDelete,
  onLeave,
  onRemoveMember,
  onViewDetails
}) => {
  const { user } = useAuth();

  const handleCopyTeamId = () => {
    navigator.clipboard.writeText(team.TeamId.toString());
  };

  const memberCountColor = team.memberCount >= team.MaxMembers ? 'text-red-600' : 
                          team.memberCount > team.MaxMembers * 0.8 ? 'text-orange-600' : 
                          'text-green-600';

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1 flex-1">
            <CardTitle className="text-lg flex items-center gap-2">
              {team.TeamName}
              {team.isUserLeader && (
                <Badge variant="secondary" className="text-xs">
                  <Crown className="h-3 w-3 mr-1" />
                  Leader
                </Badge>
              )}
            </CardTitle>
            <CardDescription className="flex items-center gap-2">
              <Calendar className="h-3 w-3" />
              {team.EventName}
            </CardDescription>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onViewDetails?.(team.TeamId)}>
                <ExternalLink className="h-4 w-4 mr-2" />
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleCopyTeamId}>
                <Copy className="h-4 w-4 mr-2" />
                Copy Team ID
              </DropdownMenuItem>
              {team.isUserLeader && (
                <React.Fragment key="leader-actions">
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => onEdit?.(team)}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Team
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => onDelete?.(team.TeamId)}
                    className="text-red-600"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Team
                  </DropdownMenuItem>
                </React.Fragment>
              )}
              {!team.isUserLeader && team.isUserMember && (
                <React.Fragment key="member-actions">
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={() => onLeave?.(team.TeamId)}
                    className="text-red-600"
                  >
                    <UserMinus className="h-4 w-4 mr-2" />
                    Leave Team
                  </DropdownMenuItem>
                </React.Fragment>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        {team.Description && (
          <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
            {team.Description}
          </p>
        )}

        <div className="space-y-3">
          {/* Member Count */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">Members</span>
            </div>
            <span className={`text-sm font-medium ${memberCountColor}`}>
              {team.memberCount}/{team.MaxMembers}
            </span>
          </div>

          {/* Team Members Preview */}
          {team.members && team.members.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Team Members
              </h4>
              <div className="space-y-1">
                {team.members.slice(0, 3).map((member, index) => (
                  <div key={`member-${team.TeamId}-${member.UserId || index}`} className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarFallback className="text-xs">
                        {member.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-xs text-muted-foreground truncate flex-1">
                      {member.name}
                    </span>
                    {member.IsLeader && (
                      <Crown className="h-3 w-3 text-orange-500" />
                    )}
                  </div>
                ))}
                {team.members.length > 3 && (
                  <p className="text-xs text-muted-foreground">
                    +{team.members.length - 3} more members
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Team Status */}
          <div className="flex items-center justify-between pt-2 border-t">
            <span className="text-xs text-muted-foreground">
              Created {format(new Date(team.CreatedAt), 'MMM dd, yyyy')}
            </span>
            <Badge variant={team.IsActive ? "default" : "secondary"} className="text-xs">
              {team.IsActive ? "Active" : "Inactive"}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
