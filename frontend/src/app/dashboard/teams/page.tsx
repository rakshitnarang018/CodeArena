"use client";

import { useState, useEffect, useMemo } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useTeams, Team } from "@/hooks/useTeams";
import { useOrganizerData } from "@/hooks/useOrganizerData";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Loader2, Users, AlertCircle, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import {
  TeamStatsCards,
  TeamCard,
  CreateTeamDialog,
  EditTeamDialog,
  TeamFilters,
  ConfirmDialog,
} from "./_components";

const TeamsPage = () => {
  const { user } = useAuth();
  const { myEvents } = useOrganizerData();

  const {
    teams,
    stats,
    loading,
    error,
    refetch,
    createTeam,
    updateTeam,
    deleteTeam,
    leaveTeam,
  } = useTeams();

  // Dialog states
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingTeam, setEditingTeam] = useState<Team | null>(null);
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    title: string;
    description: string;
    onConfirm: () => void;
    variant?: "default" | "destructive";
  }>({
    open: false,
    title: "",
    description: "",
    onConfirm: () => {},
  });

  // Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedEvent, setSelectedEvent] = useState("all");
  const [selectedRole, setSelectedRole] = useState("all");

  // Filter teams based on search and filters
  const filteredTeams = useMemo(() => {
    let filtered = [...teams];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (team) =>
          team.TeamName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          team.EventName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          team.Description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Event filter
    if (selectedEvent !== "all") {
      filtered = filtered.filter(
        (team) => team.EventId.toString() === selectedEvent
      );
    }

    // Role filter
    if (selectedRole === "leader") {
      filtered = filtered.filter((team) => team.isUserLeader);
    } else if (selectedRole === "member") {
      filtered = filtered.filter(
        (team) => team.isUserMember && !team.isUserLeader
      );
    }

    return filtered;
  }, [teams, searchQuery, selectedEvent, selectedRole]);

  // Get unique events from teams for filter dropdown
  const availableEvents = useMemo(() => {
    const uniqueEvents = new Map();
    teams.forEach((team) => {
      if (!uniqueEvents.has(team.EventId)) {
        uniqueEvents.set(team.EventId, {
          EventID: team.EventId,
          Name: team.EventName,
        });
      }
    });
    return Array.from(uniqueEvents.values());
  }, [teams]);

  const handleCreateTeam = async (teamData: {
    teamName: string;
    eventId: number;
    description?: string;
    maxMembers?: number;
  }) => {
    const result = await createTeam(teamData);

    if (result.success) {
      toast.success("Team created successfully!");
      setCreateDialogOpen(false);
    } else {
      toast.error(result.error || "Failed to create team");
    }

    return result;
  };

  const handleEditTeam = (team: Team) => {
    setEditingTeam(team);
    setEditDialogOpen(true);
  };

  const handleUpdateTeam = async (
    teamId: number,
    updateData: {
      teamName?: string;
      description?: string;
      maxMembers?: number;
    }
  ) => {
    const result = await updateTeam(teamId, updateData);

    if (result.success) {
      toast.success("Team updated successfully!");
      setEditDialogOpen(false);
      setEditingTeam(null);
    } else {
      toast.error(result.error || "Failed to update team");
    }

    return result;
  };

  const handleDeleteTeam = (teamId: number) => {
    const team = teams.find((t) => t.TeamId === teamId);
    setConfirmDialog({
      open: true,
      title: "Delete Team",
      description: `Are you sure you want to delete "${team?.TeamName}"? This action cannot be undone and will remove all team members.`,
      onConfirm: async () => {
        const result = await deleteTeam(teamId);
        if (result.success) {
          toast.success("Team deleted successfully");
        } else {
          toast.error(result.error || "Failed to delete team");
        }
        setConfirmDialog((prev) => ({ ...prev, open: false }));
      },
      variant: "destructive",
    });
  };

  const handleLeaveTeam = (teamId: number) => {
    const team = teams.find((t) => t.TeamId === teamId);
    setConfirmDialog({
      open: true,
      title: "Leave Team",
      description: `Are you sure you want to leave "${team?.TeamName}"? You can rejoin later if there's space available.`,
      onConfirm: async () => {
        const result = await leaveTeam(teamId);
        if (result.success) {
          toast.success("Left team successfully");
        } else {
          toast.error(result.error || "Failed to leave team");
        }
        setConfirmDialog((prev) => ({ ...prev, open: false }));
      },
      variant: "destructive",
    });
  };

  const handleViewDetails = (teamId: number) => {
    // Navigate to team details page (implement later)
    toast.info("Team details page coming soon!");
  };

  if (loading && teams.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading teams...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pl-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Teams</h1>
          <p className="text-muted-foreground">
            Manage your teams and collaborate with others
          </p>
        </div>
        <Button onClick={() => refetch()} variant="outline" size="sm">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      <TeamStatsCards stats={stats} loading={loading} />

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <TeamFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedEvent={selectedEvent}
        onEventChange={setSelectedEvent}
        selectedRole={selectedRole}
        onRoleChange={setSelectedRole}
        onCreateTeam={() => setCreateDialogOpen(true)}
        availableEvents={availableEvents}
      />

      {filteredTeams.length === 0 ? (
        <div className="text-center py-12">
          <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">
            {searchQuery || selectedEvent !== "all" || selectedRole !== "all"
              ? "No teams found"
              : "No teams yet"}
          </h3>
          <p className="text-muted-foreground mb-4">
            {searchQuery || selectedEvent !== "all" || selectedRole !== "all"
              ? "Try adjusting your filters to find teams."
              : "Create your first team to start collaborating with others."}
          </p>
          {!searchQuery &&
            selectedEvent === "all" &&
            selectedRole === "all" && (
              <Button onClick={() => setCreateDialogOpen(true)}>
                <Users className="h-4 w-4 mr-2" />
                Create Your First Team
              </Button>
            )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTeams.map((team) => (
            <TeamCard
              key={team.TeamId}
              team={team}
              onEdit={handleEditTeam}
              onDelete={handleDeleteTeam}
              onLeave={handleLeaveTeam}
              onViewDetails={handleViewDetails}
            />
          ))}
        </div>
      )}

      <CreateTeamDialog
        open={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
        onSubmit={handleCreateTeam}
      />

      <EditTeamDialog
        open={editDialogOpen}
        onClose={() => {
          setEditDialogOpen(false);
          setEditingTeam(null);
        }}
        team={editingTeam}
        onSubmit={handleUpdateTeam}
      />

      <ConfirmDialog
        open={confirmDialog.open}
        onClose={() => setConfirmDialog((prev) => ({ ...prev, open: false }))}
        onConfirm={confirmDialog.onConfirm}
        title={confirmDialog.title}
        description={confirmDialog.description}
        variant={confirmDialog.variant}
        confirmText={
          confirmDialog.variant === "destructive" ? "Delete" : "Confirm"
        }
      />
    </div>
  );
};

export default TeamsPage;
