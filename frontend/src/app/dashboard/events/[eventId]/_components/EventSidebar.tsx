"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Calendar,
  MapPin,
  Users,
  Trophy,
  Clock,
  DollarSign,
  UserPlus,
  CheckCircle,
  Star,
  User,
  Crown,
  Copy,
  Settings,
  FileText,
  Upload,
  Plus,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { TeamEnrollmentDialog } from "./TeamEnrollmentDialog";
import { TeamManagementDialog } from "./TeamManagementDialog";
import { SubmissionForm } from "@/app/dashboard/submissions/_components";
import { Event } from "./types";
import { toast } from "sonner";
import { apiRequest } from "@/lib/api";

interface EventSidebarProps {
  event: Event;
  isRegistered: boolean;
  userTeam?: any;
  teamsLoading?: boolean;
  onRegister: () => void;
  formatDateTime: (dateString: string) => string;
}

export const EventSidebar = ({
  event,
  isRegistered,
  userTeam,
  teamsLoading,
  onRegister,
  formatDateTime,
}: EventSidebarProps) => {
  const { user } = useAuth();
  const [isEnrolled, setIsEnrolled] = useState(isRegistered);
  const [loading, setLoading] = useState(false);
  const [enrollmentDialogOpen, setEnrollmentDialogOpen] = useState(false);
  const [teamManagementOpen, setTeamManagementOpen] = useState(false);
  const [submissionFormOpen, setSubmissionFormOpen] = useState(false);
  const [existingSubmission, setExistingSubmission] = useState<any>(null);
  const [submissionLoading, setSubmissionLoading] = useState(false);

  useEffect(() => {
    setIsEnrolled(isRegistered);
    
    // Check for existing submission when enrolled
    if (isRegistered && userTeam?.TeamId && event?.EventID) {
      checkExistingSubmission();
    }
  }, [isRegistered, userTeam, event]);

  const checkExistingSubmission = async () => {
    if (!userTeam?.TeamId || !event?.EventID) return;
    
    try {
      setSubmissionLoading(true);
      const response = await apiRequest<{ data: any[] }>('/submissions/my-submissions');
      const submission = response.data?.find(
        sub => sub.eventId === event.EventID && sub.teamId === userTeam.TeamId
      );
      setExistingSubmission(submission || null);
    } catch (error) {
      console.error('Error checking existing submission:', error);
    } finally {
      setSubmissionLoading(false);
    }
  };

  const handleEnrollmentSuccess = () => {
    setIsEnrolled(true);
    setEnrollmentDialogOpen(false);
    onRegister();
  };

  const handleSubmissionSuccess = async (submissionData: any) => {
    try {
      if (existingSubmission) {
        // Update existing submission
        await apiRequest(`/submissions/${existingSubmission._id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(submissionData)
        });
        toast.success('Submission updated successfully!');
      } else {
        // Create new submission
        await apiRequest('/submissions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(submissionData)
        });
        toast.success('Submission created successfully!');
      }
      
      setSubmissionFormOpen(false);
      checkExistingSubmission(); // Refresh submission data
    } catch (error: any) {
      console.error('Error with submission:', error);
      toast.error(error.message || 'Failed to submit');
    }
  };

  const isEventLive = event?.IsActive;
  const canSubmit = isEventLive && isEnrolled && userTeam;

  const isEventPast = new Date(event.EndDate) < new Date();

  return (
    <div className="space-y-6">
      <Card className="card-optimized">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5" />
            Registration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {isEventPast ? (
            <Badge variant="secondary" className="w-full justify-center py-2">
              Event Ended
            </Badge>
          ) : isEnrolled ? (
            <div className="space-y-3">
              <Badge
                variant="default"
                className="w-full justify-center py-2 bg-green-100 text-green-700 border-green-200"
              >
                ✓ Registered
              </Badge>
              <Button
                onClick={() => setEnrollmentDialogOpen(true)}
                variant="outline"
                className="w-full border-green-300 text-green-700 hover:bg-green-50"
                size="lg"
              >
                <Users className="h-4 w-4 mr-2" />
                View Team Details
              </Button>
              <p className="text-xs text-muted-foreground text-center">
                Manage your team and enrollment
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              <Button
                onClick={() => setEnrollmentDialogOpen(true)}
                className="w-full bg-primary hover:bg-primary/90"
                size="lg"
                disabled={loading}
              >
                <UserPlus className="h-4 w-4 mr-2" />
                Register Now
              </Button>
              <p className="text-xs text-muted-foreground text-center">
                Join other teams in this exciting event
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {isRegistered && userTeam && !isEventPast && (
        <Card className="card-optimized">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Your Team
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-lg">{userTeam.TeamName}</h3>
                <p className="text-sm text-muted-foreground">
                  {userTeam.MemberCount}/{event.MaxTeamSize} members • Your
                  role: {userTeam.Role}
                </p>
              </div>
              <Badge
                variant={userTeam.Role === "Leader" ? "default" : "secondary"}
              >
                {userTeam.Role === "Leader" ? (
                  <Crown className="h-3 w-3 mr-1" />
                ) : null}
                {userTeam.Role}
              </Badge>
            </div>

            <div className="space-y-2">
              <h4 className="text-sm font-medium">Team Members</h4>
              <div className="space-y-2">
                {userTeam.members?.map((member: any, index: number) => (
                  <div
                    key={member.userid || index}
                    className="flex items-center gap-3 p-2 bg-accent/50 rounded-lg"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="text-xs">
                        {member.name?.charAt(0)?.toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">
                          {member.name}
                        </span>
                        {member.Role === "Leader" && (
                          <Crown className="h-3 w-3 text-yellow-600" />
                        )}
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {member.email}
                      </span>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {member.Role}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={() => {
                  navigator.clipboard.writeText(
                    `${window.location.origin}/teams/${userTeam.TeamId}/join`
                  );
                  toast.info("Invite link copied to clipboard!");
                }}
              >
                <Copy className="h-4 w-4 mr-1" />
                Invite
              </Button>
              {userTeam.Role === "Leader" && (
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => setTeamManagementOpen(true)}
                >
                  <Users className="h-4 w-4 mr-1" />
                  Manage Team
                </Button>
              )}
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={() => setEnrollmentDialogOpen(true)}
              >
                <Settings className="h-4 w-4 mr-1" />
                Settings
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {!isRegistered && !teamsLoading && (
        <Card className="card-optimized border-dashed border-2 border-muted-foreground/25">
          <CardContent className="text-center py-8">
            <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="font-semibold mb-2">Join This Event</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Enroll in this event to see your team details here
            </p>
            <Button
              onClick={() => setEnrollmentDialogOpen(true)}
              className="w-full"
            >
              <UserPlus className="h-4 w-4 mr-2" />
              Enroll Now
            </Button>
          </CardContent>
        </Card>
      )}

      <Card className="card-optimized">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Important Dates
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Event Start</span>
            <span className="text-sm font-medium">
              {formatDateTime(event.StartDate)}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Event End</span>
            <span className="text-sm font-medium">
              {formatDateTime(event.EndDate)}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">
              Submission Deadline
            </span>
            <span className="text-sm font-medium">
              {event.SubmissionDeadline
                ? formatDateTime(event.SubmissionDeadline)
                : "TBD"}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Results</span>
            <span className="text-sm font-medium">
              {event.ResultDate ? formatDateTime(event.ResultDate) : "TBD"}
            </span>
          </div>
        </CardContent>
      </Card>

      <Card className="card-optimized">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5" />
            Event Statistics
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Event Mode</span>
            <span className="text-lg font-bold text-primary">{event.Mode}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Event Theme</span>
            <span className="text-lg font-bold text-blue-600">
              {event.Theme}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Max Team Size</span>
            <span className="text-lg font-bold text-orange-600">
              {event.MaxTeamSize}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Submission Section - Only show when event is live and user is enrolled */}
      {canSubmit && (
        <Card className="card-optimized">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Project Submission
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {submissionLoading ? (
              <div className="flex items-center justify-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
              </div>
            ) : existingSubmission ? (
              <div className="space-y-3">
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="font-medium text-green-800">Submitted</span>
                  </div>
                  <p className="text-sm font-medium text-green-700 mb-1">
                    {existingSubmission.title}
                  </p>
                  <p className="text-xs text-green-600">
                    Track: {existingSubmission.track}
                  </p>
                </div>
                <Button
                  onClick={() => setSubmissionFormOpen(true)}
                  variant="outline"
                  className="w-full"
                  size="lg"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Update Submission
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="text-center p-4 border border-dashed border-muted-foreground/30 rounded-lg">
                  <FileText className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">
                    Submit your project for this event
                  </p>
                </div>
                <Button
                  onClick={() => setSubmissionFormOpen(true)}
                  className="w-full bg-primary hover:bg-primary/90"
                  size="lg"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Submit Project
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Show info when event is not active but user is enrolled */}
      {isEnrolled && !isEventLive && !isEventPast && (
        <Card className="card-optimized border-yellow-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-yellow-700">
              <Clock className="h-5 w-5" />
              Submission Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center p-4">
              <Clock className="h-8 w-8 mx-auto text-yellow-600 mb-2" />
              <p className="text-sm text-yellow-700 font-medium mb-1">
                Submissions not yet open
              </p>
              <p className="text-xs text-yellow-600">
                Wait for the event to become active to submit your project
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="card-optimized">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Organizer
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarFallback className="bg-primary/10 text-primary">
                O{event.OrganizerID}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium">Organizer #{event.OrganizerID}</div>
              <div className="text-sm text-muted-foreground">
                Event Organizer
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <TeamEnrollmentDialog
        isOpen={enrollmentDialogOpen}
        onClose={() => setEnrollmentDialogOpen(false)}
        onEnrollmentSuccess={handleEnrollmentSuccess}
        eventId={event.EventID}
        eventName={event.Name}
        maxTeamSize={event.MaxTeamSize}
      />

      {userTeam?.TeamId && (
        <TeamManagementDialog
          isOpen={teamManagementOpen}
          onClose={() => setTeamManagementOpen(false)}
          team={userTeam}
          userRole={userTeam.Role}
          onMemberRemoved={() => {
            onRegister?.();
          }}
        />
      )}

      {/* Submission Form Dialog */}
      {canSubmit && (
        <SubmissionForm
          isOpen={submissionFormOpen}
          onClose={() => setSubmissionFormOpen(false)}
          onSubmit={handleSubmissionSuccess}
          initialData={existingSubmission}
          prefilledData={{ eventId: event.EventID, teamId: userTeam?.TeamId }}
        />
      )}
    </div>
  );
};
