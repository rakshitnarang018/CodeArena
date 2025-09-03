'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  Users, 
  Plus, 
  UserPlus, 
  Phone,
  Check,
  AlertCircle,
  Crown
} from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { apiRequest } from '@/lib/api';

interface Team {
  TeamId: number;
  TeamName: string;
  EventId: number;
  CreatedAt: string;
  members: TeamMember[];
}

interface TeamMember {
  userid: number;
  name: string;
  email: string;
  Role: string;
}

interface TeamEnrollmentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  eventId: number;
  eventName: string;
  maxTeamSize: number;
  onEnrollmentSuccess: () => void;
}

interface TeamFormData {
  teamName: string;
}

export const TeamEnrollmentDialog = ({ 
  isOpen, 
  onClose, 
  eventId, 
  eventName, 
  maxTeamSize,
  onEnrollmentSuccess 
}: TeamEnrollmentDialogProps) => {
  const { user } = useAuth();
  const router = useRouter();
  const [step, setStep] = useState<'choose' | 'create' | 'join' | 'success'>('choose');
  const [loading, setLoading] = useState(false);
  const [existingTeams, setExistingTeams] = useState<Team[]>([]);
  const [availableTeams, setAvailableTeams] = useState<Team[]>([]);
  const [createdTeam, setCreatedTeam] = useState<Team | null>(null);

  const { register, handleSubmit, formState: { errors }, reset } = useForm<TeamFormData>();

  useEffect(() => {
    if (isOpen) {
      fetchUserTeams();
      fetchAvailableTeams();
      setStep('choose');
      reset();
    }
  }, [isOpen, reset]);

  const fetchUserTeams = async () => {
    try {
      const response = await apiRequest<{ data: Team[] }>('/teams/my-teams', {
        method: 'GET'
      });
      
      // Filter teams for this specific event
      const eventTeams = response.data?.filter(team => team.EventId === eventId) || [];
      setExistingTeams(eventTeams);
    } catch (error) {
      console.error('Error fetching teams:', error);
      setExistingTeams([]);
    }
  };

  const fetchAvailableTeams = async () => {
    try {
      const response = await apiRequest<{ data: Team[] }>(`/teams/event/${eventId}`, {
        method: 'GET'
      });
      
      // Filter out teams that are full or that the user is already a member of
      const teamsToJoin = response.data?.filter(team => {
        const isMember = team.members?.some(member => 
          member?.userid && user?.id && member.userid.toString() === user.id
        );
        const isFull = team.members && team.members.length >= maxTeamSize;
        return !isMember && !isFull;
      }) || [];
      
      setAvailableTeams(teamsToJoin);
    } catch (error) {
      console.error('Error fetching available teams:', error);
      setAvailableTeams([]);
    }
  };

  const createTeam = async (data: TeamFormData) => {
    setLoading(true);
    try {
      const response = await apiRequest<{ data: Team }>('/teams/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          teamName: data.teamName,
          eventId: eventId
        })
      });

      // Enroll in the event
      await apiRequest(`/events/${eventId}/enroll`, {
        method: 'POST'
      });

      setCreatedTeam(response.data);
      setStep('success');
      toast('Team created and enrolled successfully!');
    } catch (error: any) {
      console.error('Error creating team:', error);
      
      // Check if user is already part of a team for this event
      if (error?.message?.includes('already part of a team')) {
        toast('You are already part of a team for this event');
        // Refresh user teams to show current team
        await fetchUserTeams();
        setStep('choose');
      } else {
        toast('Failed to create team. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const joinExistingTeam = async (teamId: number) => {
    setLoading(true);
    try {
      await apiRequest(`/teams/${teamId}/join`, {
        method: 'POST'
      });

      // Enroll in the event
      await apiRequest(`/events/${eventId}/enroll`, {
        method: 'POST'
      });

      toast('Successfully joined team!');
      onEnrollmentSuccess();
      onClose();
    } catch (error: any) {
      console.error('Error joining team:', error);
      
      // Check if user is already part of a team for this event
      if (error?.message?.includes('already part of a team')) {
        toast('You are already part of a team for this event');
        // Refresh user teams to show current team
        await fetchUserTeams();
        setStep('choose');
      } else {
        toast('Failed to join team. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const joinTeam = async (teamId: number) => {
    if (!teamId) {
      console.error('Team ID is undefined or invalid:', teamId);
      toast('Invalid team ID. Please try again.');
      return;
    }
    
    setLoading(true);
    try {
      await apiRequest(`/teams/${teamId}/join`, {
        method: 'POST'
      });

      // Enroll in the event
      await apiRequest(`/events/${eventId}/enroll`, {
        method: 'POST'
      });

      toast('Successfully joined team!');
      setStep('success');
      
      // Fetch the team details for success display
      const teamResponse = await apiRequest<{ data: Team }>(`/teams/${teamId}`, {
        method: 'GET'
      });
      setCreatedTeam(teamResponse.data);
    } catch (error: any) {
      console.error('Error joining team:', error);
      
      // Check if user is already part of a team for this event
      if (error?.message?.includes('already part of a team')) {
        toast('You are already part of a team for this event');
        // Refresh user teams to show current team
        await fetchUserTeams();
        setStep('choose');
      } else {
        toast('Failed to join team. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (step === 'success') {
      onEnrollmentSuccess();
    }
    onClose();
    setStep('choose');
    setCreatedTeam(null);
    setAvailableTeams([]);
  };

  const renderChooseStep = () => {
    const hasEnrolledTeam = existingTeams.some(team => 
      team.members?.some(member => 
        member?.userid && user?.id && member.userid.toString() === user.id
      )
    );

    return (
      <div className="space-y-6">
        <div className="text-center">
          <h3 className="text-lg font-semibold mb-2">
            {hasEnrolledTeam ? `Your Status: ${eventName}` : `Join ${eventName}`}
          </h3>
          <p className="text-muted-foreground">
            {hasEnrolledTeam 
              ? 'You are already enrolled in this event with your team'
              : 'You can either create a new team or join an existing one'
            }
          </p>
        </div>

        {existingTeams.length > 0 && (
          <div>
            <h4 className="font-medium mb-3">Your Teams for this Event</h4>
            <div className="space-y-2">
              {existingTeams.map((team) => {
                const isUserMember = team.members?.some(member => 
                  member?.userid && user?.id && member.userid.toString() === user.id
                );
                
                return (
                  <Card key={team.TeamId} className="bg-green-50 border-green-200">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                            <Users className="h-5 w-5 text-green-600" />
                          </div>
                          <div>
                            <h5 className="font-medium text-green-900">{team.TeamName}</h5>
                            <p className="text-sm text-green-700">
                              {team.members?.length || 0}/{maxTeamSize} members
                            </p>
                          </div>
                        </div>
                        {isUserMember ? (
                          <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-300">
                            <Check className="h-3 w-3 mr-1" />
                            Enrolled
                          </Badge>
                        ) : (
                          <Button 
                            size="sm" 
                            onClick={() => joinExistingTeam(team.TeamId)}
                            disabled={loading}
                            variant="outline"
                            className="border-green-300 text-green-700 hover:bg-green-100"
                          >
                            <UserPlus className="h-4 w-4 mr-1" />
                            Join
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
            
            {existingTeams.some(team => 
              team.members?.some(member => 
                member?.userid && user?.id && member.userid.toString() === user.id
              )
            ) && (
              <div className="mt-4 flex justify-center">
                <Button 
                  onClick={handleClose}
                  variant="outline"
                  className="border-blue-300 text-blue-700 hover:bg-blue-50"
                  size="lg"
                >
                  <Users className="h-4 w-4 mr-2" />
                  View Team Details
                </Button>
              </div>
            )}
          </div>
        )}

        {!hasEnrolledTeam && (
          <>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  {existingTeams.length > 0 ? 'Or Create/Join New Team' : 'Choose Option'}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Button 
                onClick={() => setStep('create')} 
                className="flex-1" 
                size="lg"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Team
              </Button>
              
              <Button 
                onClick={() => setStep('join')} 
                variant="outline"
                className="flex-1" 
                size="lg"
              >
                <UserPlus className="h-4 w-4 mr-2" />
                Join Team
              </Button>
            </div>
          </>
        )}
      </div>
    );
  };

  const renderJoinStep = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold mb-2">Join a Team</h3>
        <p className="text-muted-foreground">
          Choose from available teams looking for members
        </p>
      </div>

      {availableTeams.length === 0 ? (
        <div className="text-center py-8">
          <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h4 className="font-medium mb-2">No teams available</h4>
          <p className="text-sm text-muted-foreground mb-4">
            There are no teams currently looking for members
          </p>
          <Button 
            onClick={() => setStep('create')} 
            size="sm"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Your Own Team
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {availableTeams.map((team, teamIndex) => (
            <Card key={team?.TeamId || `team-${teamIndex}`} className="hover:bg-accent/50 transition-colors">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <Users className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h5 className="font-medium">{team.TeamName}</h5>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>{team.members?.length || 0}/{maxTeamSize} members</span>
                        <span>•</span>
                        <span>Created {new Date(team.CreatedAt).toLocaleDateString()}</span>
                      </div>
                      {team.members && team.members.length > 0 && (
                        <div className="flex items-center gap-2 mt-2">
                          <div className="flex -space-x-2">
                            {team.members.slice(0, 3).map((member, index) => (
                              <Avatar key={member?.userid || `member-${index}`} className="w-6 h-6 border-2 border-background">
                                <AvatarFallback className="text-xs">
                                  {member?.name ? member.name.charAt(0).toUpperCase() : 'U'}
                                </AvatarFallback>
                              </Avatar>
                            ))}
                          </div>
                          {team.members.length > 3 && (
                            <span className="text-xs text-muted-foreground">
                              +{team.members.length - 3} more
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                  <Button 
                    size="sm" 
                    onClick={() => joinTeam(team.TeamId)}
                    disabled={loading}
                    className="ml-4"
                  >
                    {loading ? (
                      <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <UserPlus className="h-4 w-4 mr-1" />
                        Join
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <div className="flex gap-3">
        <Button 
          variant="outline" 
          onClick={() => setStep('choose')}
          className="flex-1"
        >
          Back
        </Button>
      </div>
    </div>
  );

  const renderCreateStep = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold mb-2">Create Your Team</h3>
        <p className="text-muted-foreground">
          Choose a unique name for your team
        </p>
      </div>

      <form onSubmit={handleSubmit(createTeam)} className="space-y-4">
        <div>
          <Label htmlFor="teamName">Team Name</Label>
          <Input
            id="teamName"
            {...register('teamName', { 
              required: 'Team name is required',
              minLength: { value: 3, message: 'Team name must be at least 3 characters' },
              maxLength: { value: 50, message: 'Team name cannot exceed 50 characters' }
            })}
            placeholder="Enter your team name"
            className="mt-1"
          />
          {errors.teamName && (
            <p className="text-sm text-red-600 mt-1">{errors.teamName.message}</p>
          )}
        </div>

        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <h4 className="font-medium text-blue-900 mb-2">What happens next?</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• You'll become the team leader</li>
            <li>• You'll be automatically enrolled in the event</li>
            <li>• You can invite others to join later</li>
          </ul>
        </div>

        <div className="flex gap-3">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => setStep('choose')}
            className="flex-1"
          >
            Back
          </Button>
          <Button 
            type="submit" 
            disabled={loading}
            className="flex-1"
          >
            {loading ? 'Creating...' : 'Create Team & Enroll'}
          </Button>
        </div>
      </form>
    </div>
  );

  const renderSuccessStep = () => (
    <div className="space-y-6 text-center">
      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
        <Check className="h-8 w-8 text-green-600" />
      </div>
      
      <div>
        <h3 className="text-lg font-semibold mb-2">Welcome to {eventName}!</h3>
        <p className="text-muted-foreground">
          You've successfully joined the event with your team
        </p>
      </div>

      {createdTeam && (
        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <Users className="h-6 w-6 text-green-600" />
              </div>
              <div className="text-left">
                <h4 className="font-semibold text-green-900">{createdTeam.TeamName}</h4>
                <p className="text-sm text-green-700">Your team is ready for the event!</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Button onClick={handleClose} className="w-full" size="lg">
        View Event Dashboard
      </Button>
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {step === 'choose' && (existingTeams.some(team => 
              team.members?.some(member => 
                member?.userid && user?.id && member.userid.toString() === user.id
              )
            ) ? 'Event Status' : 'Event Enrollment')}
            {step === 'create' && 'Create Team'}
            {step === 'join' && 'Join Team'}
            {step === 'success' && 'Enrollment Complete'}
          </DialogTitle>
          <DialogDescription>
            {step === 'choose' && (existingTeams.some(team => 
              team.members?.some(member => 
                member?.userid && user?.id && member.userid.toString() === user.id
              )
            ) ? 'You are already enrolled in this event' : 'Choose how you want to participate in this event')}
            {step === 'create' && 'Set up your team for the event'}
            {step === 'join' && 'Select a team to join for this event'}
            {step === 'success' && 'You are now enrolled in the event'}
          </DialogDescription>
        </DialogHeader>

        {step === 'choose' && renderChooseStep()}
        {step === 'create' && renderCreateStep()}
        {step === 'join' && renderJoinStep()}
        {step === 'success' && renderSuccessStep()}
      </DialogContent>
    </Dialog>
  );
};