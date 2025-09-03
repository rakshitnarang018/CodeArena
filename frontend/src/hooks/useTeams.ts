import { useState, useEffect, useCallback, useRef } from 'react';
import { apiRequest } from '@/lib/api';

export interface TeamMember {
  UserId: number;
  name: string;
  email: string;
  role: string;
  JoinedAt: string;
  IsLeader: boolean;
}

export interface Team {
  TeamId: number;
  TeamName: string;
  EventId: number;
  EventName: string;
  Description?: string;
  MaxMembers: number;
  CreatedAt: string;
  UpdatedAt: string;
  IsActive: boolean;
  members: TeamMember[];
  memberCount: number;
  isUserMember: boolean;
  isUserLeader: boolean;
}

export interface TeamStats {
  totalTeams: number;
  teamsAsLeader: number;
  teamsAsMember: number;
  totalEvents: number;
}

export const useTeams = () => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [stats, setStats] = useState<TeamStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTeams = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiRequest<{
        success: boolean;
        message: string;
        data: Team[];
        stats?: TeamStats;
      }>('/teams/my-teams', { method: 'GET' });

      if (response.success) {
        setTeams(response.data || []);
        setStats(response.stats || {
          totalTeams: response.data?.length || 0,
          teamsAsLeader: response.data?.filter(t => t.isUserLeader).length || 0,
          teamsAsMember: response.data?.filter(t => t.isUserMember && !t.isUserLeader).length || 0,
          totalEvents: new Set(response.data?.map(t => t.EventId)).size || 0
        });
      } else {
        setError(response.message || 'Failed to fetch teams');
      }
    } catch (error) {
      console.error('Error fetching teams:', error);
      setError(error instanceof Error ? error.message : 'Failed to fetch teams');
    } finally {
      setLoading(false);
    }
  }, []);

  const createTeam = useCallback(async (teamData: {
    teamName: string;
    eventId: number;
    description?: string;
    maxMembers?: number;
  }) => {
    try {
      const response = await apiRequest<{
        success: boolean;
        message: string;
        data: Team;
      }>('/teams', {
        method: 'POST',
        body: JSON.stringify(teamData)
      });

      if (response.success) {
        await fetchTeams(); // Refresh teams list
        return { success: true, data: response.data };
      } else {
        return { success: false, error: response.message };
      }
    } catch (error) {
      console.error('Error creating team:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to create team' 
      };
    }
  }, [fetchTeams]);

  const joinTeam = useCallback(async (teamId: number) => {
    try {
      const response = await apiRequest<{
        success: boolean;
        message: string;
      }>(`/teams/${teamId}/join`, {
        method: 'POST'
      });

      if (response.success) {
        await fetchTeams(); // Refresh teams list
        return { success: true };
      } else {
        return { success: false, error: response.message };
      }
    } catch (error) {
      console.error('Error joining team:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to join team' 
      };
    }
  }, [fetchTeams]);

  const leaveTeam = useCallback(async (teamId: number) => {
    try {
      const response = await apiRequest<{
        success: boolean;
        message: string;
      }>(`/teams/${teamId}/leave`, {
        method: 'POST'
      });

      if (response.success) {
        await fetchTeams(); // Refresh teams list
        return { success: true };
      } else {
        return { success: false, error: response.message };
      }
    } catch (error) {
      console.error('Error leaving team:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to leave team' 
      };
    }
  }, [fetchTeams]);

  const updateTeam = useCallback(async (teamId: number, updateData: {
    teamName?: string;
    description?: string;
    maxMembers?: number;
  }) => {
    try {
      const response = await apiRequest<{
        success: boolean;
        message: string;
        data: Team;
      }>(`/teams/${teamId}`, {
        method: 'PUT',
        body: JSON.stringify(updateData)
      });

      if (response.success) {
        await fetchTeams(); // Refresh teams list
        return { success: true, data: response.data };
      } else {
        return { success: false, error: response.message };
      }
    } catch (error) {
      console.error('Error updating team:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to update team' 
      };
    }
  }, [fetchTeams]);

  const deleteTeam = useCallback(async (teamId: number) => {
    try {
      const response = await apiRequest<{
        success: boolean;
        message: string;
      }>(`/teams/${teamId}`, {
        method: 'DELETE'
      });

      if (response.success) {
        await fetchTeams(); // Refresh teams list
        return { success: true };
      } else {
        return { success: false, error: response.message };
      }
    } catch (error) {
      console.error('Error deleting team:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to delete team' 
      };
    }
  }, [fetchTeams]);

  const removeMember = useCallback(async (teamId: number, memberId: number) => {
    try {
      const response = await apiRequest<{
        success: boolean;
        message: string;
      }>(`/teams/${teamId}/members/${memberId}`, {
        method: 'DELETE'
      });

      if (response.success) {
        await fetchTeams(); // Refresh teams list
        return { success: true };
      } else {
        return { success: false, error: response.message };
      }
    } catch (error) {
      console.error('Error removing member:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to remove member' 
      };
    }
  }, [fetchTeams]);

  useEffect(() => {
    fetchTeams();
  }, [fetchTeams]);

  return {
    teams,
    stats,
    loading,
    error,
    refetch: fetchTeams,
    createTeam,
    joinTeam,
    leaveTeam,
    updateTeam,
    deleteTeam,
    removeMember
  };
};

export const useTeamsByEvent = (eventId: number) => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTeamsByEvent = useCallback(async () => {
    if (!eventId) return;

    setLoading(true);
    setError(null);

    try {
      const response = await apiRequest<{
        success: boolean;
        message: string;
        data: Team[];
      }>(`/teams/event/${eventId}`, { method: 'GET' });

      if (response.success) {
        setTeams(response.data || []);
      } else {
        setError(response.message || 'Failed to fetch teams');
      }
    } catch (error) {
      console.error('Error fetching teams by event:', error);
      setError(error instanceof Error ? error.message : 'Failed to fetch teams');
    } finally {
      setLoading(false);
    }
  }, [eventId]);

  useEffect(() => {
    fetchTeamsByEvent();
  }, [fetchTeamsByEvent]);

  return {
    teams,
    loading,
    error,
    refetch: fetchTeamsByEvent
  };
};

export const useTeamDetails = (teamId: number) => {
  const [team, setTeam] = useState<Team | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTeamDetails = useCallback(async () => {
    if (!teamId) return;

    setLoading(true);
    setError(null);

    try {
      const response = await apiRequest<{
        success: boolean;
        message: string;
        data: Team;
      }>(`/teams/${teamId}`, { method: 'GET' });

      if (response.success) {
        setTeam(response.data);
      } else {
        setError(response.message || 'Failed to fetch team details');
      }
    } catch (error) {
      console.error('Error fetching team details:', error);
      setError(error instanceof Error ? error.message : 'Failed to fetch team details');
    } finally {
      setLoading(false);
    }
  }, [teamId]);

  useEffect(() => {
    fetchTeamDetails();
  }, [fetchTeamDetails]);

  return {
    team,
    loading,
    error,
    refetch: fetchTeamDetails
  };
};
