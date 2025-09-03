'use client';

import { useState } from 'react';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  Crown, 
  UserMinus,
  AlertTriangle
} from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { apiRequest } from '@/lib/api';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface TeamMember {
  userid: number;
  name: string;
  email: string;
  Role: string;
}

interface TeamManagementDialogProps {
  isOpen: boolean;
  onClose: () => void;
  team: {
    TeamId: number;
    TeamName: string;
    members: TeamMember[];
  };
  userRole: string;
  onMemberRemoved: () => void;
}

export const TeamManagementDialog = ({ 
  isOpen, 
  onClose, 
  team, 
  userRole,
  onMemberRemoved 
}: TeamManagementDialogProps) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [memberToRemove, setMemberToRemove] = useState<TeamMember | null>(null);

  const isLeader = userRole === 'Leader';

  const removeMember = async (memberId: number) => {
    if (!isLeader) {
      toast.error('Only team leaders can remove members');
      return;
    }

    setLoading(true);
    try {
      await apiRequest(`/teams/${team.TeamId}/members/${memberId}`, {
        method: 'DELETE'
      });

      toast.success('Member removed from team successfully');
      onMemberRemoved();
      setMemberToRemove(null);
    } catch (error: any) {
      console.error('Error removing member:', error);
      toast.error(error?.message || 'Failed to remove member');
    } finally {
      setLoading(false);
    }
  };

  const canRemoveMember = (member: TeamMember) => {
    // Can't remove yourself
    if (member.userid.toString() === user?.id) return false;
    // Only leaders can remove members
    if (!isLeader) return false;
    // Can't remove other leaders (you'd need to demote them first)
    if (member.Role === 'Leader') return false;
    
    return true;
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Team Management
            </DialogTitle>
            <DialogDescription>
              Manage your team members and settings
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Team Info */}
            <div className="p-3 bg-accent/50 rounded-lg">
              <h3 className="font-semibold">{team.TeamName}</h3>
              <p className="text-sm text-muted-foreground">
                {team.members?.length || 0} members
              </p>
            </div>

            {/* Team Members List */}
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Team Members</h4>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {team.members?.map((member, index) => (
                  <div key={member.userid || index} className="flex items-center gap-3 p-3 border rounded-lg">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="text-xs">
                        {member.name?.charAt(0)?.toUpperCase() || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">{member.name}</span>
                        {member.Role === 'Leader' && (
                          <Crown className="h-3 w-3 text-yellow-600" />
                        )}
                        {member.userid.toString() === user?.id && (
                          <Badge variant="outline" className="text-xs">You</Badge>
                        )}
                      </div>
                      <span className="text-xs text-muted-foreground">{member.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={member.Role === 'Leader' ? 'default' : 'secondary'} className="text-xs">
                        {member.Role}
                      </Badge>
                      {canRemoveMember(member) && (
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => setMemberToRemove(member)}
                          disabled={loading}
                        >
                          <UserMinus className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Leader Notice */}
            {!isLeader && (
              <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-center gap-2 text-yellow-800">
                  <AlertTriangle className="h-4 w-4" />
                  <span className="text-sm font-medium">Limited Access</span>
                </div>
                <p className="text-xs text-yellow-700 mt-1">
                  Only team leaders can manage team members
                </p>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-2">
              <Button variant="outline" onClick={onClose} className="flex-1">
                Close
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Remove Member Confirmation Dialog */}
      <AlertDialog open={!!memberToRemove} onOpenChange={() => setMemberToRemove(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Team Member</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove <strong>{memberToRemove?.name}</strong> from the team? 
              This action cannot be undone and they will lose access to team-related activities.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => memberToRemove && removeMember(memberToRemove.userid)}
              disabled={loading}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {loading ? 'Removing...' : 'Remove Member'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
