"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useState, useEffect } from "react";
import {
  Calendar,
  Trophy,
  Target,
  MoreHorizontal,
  TrendingUp,
  Clock,
  CheckCircle2,
  Users,
  Award,
  Plus,
  Settings,
  BarChart3,
  FileText,
  Eye,
  Megaphone,
  Star,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useOrganizerData } from "@/hooks/useOrganizerData";
import { apiRequest } from "@/lib/api";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";

const OrganizerDashboard = () => {
  const { user } = useAuth();
  const { stats, myEvents, recentActivities, loading } = useOrganizerData();
  const [recentAnnouncements, setRecentAnnouncements] = useState<any[]>([]);

  useEffect(() => {
    const fetchRecentAnnouncements = async () => {
      try {
        const response = await apiRequest<{ data: any[] }>("/announcements");

        const allAnnouncements = response.data || [];

        setRecentAnnouncements(allAnnouncements.slice(0, 5));
      } catch (error) {
        console.error("Error fetching announcements:", error);
      }
    };

    if (user?.role === "organizer") {
      fetchRecentAnnouncements();
    }
  }, [user]);

  const organizerStats = [
    {
      title: "Total Events",
      value: stats.totalEvents.toString(),
      change: `+${stats.upcomingEvents}`,
      trend: "up",
      icon: Calendar,
    },
    {
      title: "Active Events",
      value: stats.activeEvents.toString(),
      change: `${stats.activeEvents}/${stats.totalEvents}`,
      trend: "up",
      icon: CheckCircle2,
    },
    {
      title: "Total Registrations",
      value: stats.totalRegistrations.toString(),
      change: "+15%",
      trend: "up",
      icon: Users,
    },
    {
      title: "Total Submissions",
      value: stats.totalSubmissions.toString(),
      change: "+8%",
      trend: "up",
      icon: FileText,
    },
  ];

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold">Loading organizer dashboard...</h2>
          <p className="text-muted-foreground">
            Please wait while we fetch your data.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-20 bg-muted rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Welcome Section */}
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">Welcome back, {user?.name}! 👋</h2>
        <p className="text-muted-foreground">
          Here&apos;s an overview of your events and activities.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {organizerStats.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <Card
              key={index}
              className="card-optimized hover:shadow-md transition-fast"
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      {stat.title}
                    </p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p
                      className={`text-xs flex items-center mt-1 ${
                        stat.trend === "up" ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      <TrendingUp className="h-3 w-3 mr-1" />
                      {stat.change}
                    </p>
                  </div>
                  <div className="h-8 w-8 bg-primary/10 rounded-lg flex items-center justify-center">
                    <IconComponent className="h-4 w-4 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activities */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Recent Event Activities
                <Link href="/dashboard/announcements">
                  <Button variant="ghost" size="sm">
                    View All
                  </Button>
                </Link>
              </CardTitle>
              <CardDescription>Latest updates from your events</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentAnnouncements.length > 0 ? (
                <>
                  {/* Recent Announcements */}
                  {recentAnnouncements.map((announcement) => (
                    <div
                      key={`announcement-${announcement._id}`}
                      className="flex items-start gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors-fast"
                    >
                      <div
                        className={`h-8 w-8 rounded-lg flex items-center justify-center ${
                          announcement.isImportant
                            ? "bg-orange-100 text-orange-600"
                            : "bg-blue-100 text-blue-600"
                        }`}
                      >
                        {announcement.isImportant ? (
                          <Star className="h-4 w-4 fill-current" />
                        ) : (
                          <Megaphone className="h-4 w-4" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium">
                            {announcement.title}
                          </p>
                          {announcement.isImportant && (
                            <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded-full font-medium">
                              Important
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground flex items-center mt-1">
                          <Clock className="h-3 w-3 mr-1" />
                          {formatDistanceToNow(
                            new Date(announcement.createdAt)
                          )}{" "}
                          ago
                          {announcement.eventName && (
                            <>
                              <span className="mx-2">•</span>
                              {announcement.eventName}
                            </>
                          )}
                        </p>
                      </div>
                    </div>
                  ))}
                </>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Megaphone className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No recent activities</p>
                  <p className="text-sm">
                    Activities will appear here when you create announcements or
                    events generate activity.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions & My Events */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Organizer Actions</CardTitle>
              <CardDescription>Manage your events and settings</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-3">
              <Link href="/dashboard/events/create">
                <Button
                  variant="outline"
                  className="h-16 flex flex-col gap-2 w-full"
                >
                  <Plus className="h-5 w-5" />
                  <span className="text-xs">Create Event</span>
                </Button>
              </Link>
              <Link href="/dashboard/events/manage">
                <Button
                  variant="outline"
                  className="h-16 flex flex-col gap-2 w-full"
                >
                  <Settings className="h-5 w-5" />
                  <span className="text-xs">Manage Events</span>
                </Button>
              </Link>
              <Link href="/dashboard/analytics">
                <Button
                  variant="outline"
                  className="h-16 flex flex-col gap-2 w-full"
                >
                  <BarChart3 className="h-5 w-5" />
                  <span className="text-xs">Analytics</span>
                </Button>
              </Link>
              <Link href="/dashboard/submissions">
                <Button
                  variant="outline"
                  className="h-16 flex flex-col gap-2 w-full"
                >
                  <FileText className="h-5 w-5" />
                  <span className="text-xs">Submissions</span>
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* My Events */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                My Events
                <Link href="/dashboard/events">
                  <Button variant="ghost" size="sm">
                    <Eye className="h-4 w-4" />
                  </Button>
                </Link>
              </CardTitle>
              <CardDescription>Your recent events</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {myEvents.slice(0, 3).map((event) => (
                <div
                  key={event.EventID}
                  className="flex items-center gap-3 p-3 border rounded-lg"
                >
                  <div
                    className={`h-2 w-2 rounded-full ${
                      event.IsActive ? "bg-green-500" : "bg-gray-400"
                    }`}
                  ></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{event.Name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="text-xs">
                        {event.Mode}
                      </Badge>
                      <p className="text-xs text-muted-foreground">
                        {new Date(event.StartDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
              {myEvents.length === 0 && (
                <div className="text-center py-4 text-muted-foreground">
                  <Calendar className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No events yet</p>
                  <Link href="/dashboard/events/create">
                    <Button variant="ghost" size="sm" className="mt-2">
                      Create your first event
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

const ParticipantDashboard = () => {
  const { user } = useAuth();
  const [recentAnnouncements, setRecentAnnouncements] = useState<any[]>([]);
  const [importantAnnouncements, setImportantAnnouncements] = useState<any[]>(
    []
  );
  const [upcomingEvents, setUpcomingEvents] = useState<any[]>([]);
  const [combinedActivities, setCombinedActivities] = useState<any[]>([]);
  const [participantStats, setParticipantStats] = useState([
    {
      title: "Active Events",
      value: "0",
      change: "+0%",
      trend: "up",
      icon: Calendar,
    },
    {
      title: "Completed Challenges",
      value: "0",
      change: "+0%",
      trend: "up",
      icon: CheckCircle2,
    },
    {
      title: "Team Rank",
      value: "N/A",
      change: "0",
      trend: "up",
      icon: Trophy,
    },
    {
      title: "Points Earned",
      value: "0",
      change: "+0",
      trend: "up",
      icon: Target,
    },
  ]);

  useEffect(() => {
    const fetchRecentAnnouncements = async () => {
      try {
        const response = await apiRequest<{ data: any[] }>(
          "/announcements/my-all"
        );

        const allAnnouncements = response.data || [];

        setRecentAnnouncements(allAnnouncements);

        const activities: any[] = [];

        allAnnouncements.slice(0, 5).forEach((announcement) => {
          activities.push({
            id: `announcement-${announcement._id}`,
            title: announcement.title,
            time:
              formatDistanceToNow(new Date(announcement.createdAt)) + " ago",
            type: announcement.isImportant
              ? "important-announcement"
              : "announcement",
            icon: announcement.isImportant ? Star : Megaphone,
            isImportant: announcement.isImportant,
            eventName: announcement.eventName,
          });
        });

        setCombinedActivities(activities);
      } catch (error) {
        console.error("Error fetching announcements:", error);
      }
    };

    if (user?.role === "participant") {
      fetchRecentAnnouncements();
    }
  }, [user]);

  useEffect(() => {
    const fetchUpcomingEvents = async () => {
      try {
        const response = await apiRequest<{ data: any[] }>("/events");
        const events = response.data || [];

        const now = new Date();
        const upcoming = events
          .filter((event) => new Date(event.StartDate) > now && event.IsActive)
          .sort(
            (a, b) =>
              new Date(a.StartDate).getTime() - new Date(b.StartDate).getTime()
          )
          .slice(0, 3);

        setUpcomingEvents(upcoming);

        const activeEvents = events.filter((event) => event.IsActive).length;
        setParticipantStats((prev) =>
          prev.map((stat) => {
            if (stat.title === "Active Events") {
              return { ...stat, value: activeEvents.toString() };
            }
            return stat;
          })
        );
      } catch (error) {
        console.error("Error fetching upcoming events:", error);
      }
    };

    if (user?.role === "participant") {
      fetchUpcomingEvents();
    }
  }, [user]);

  return (
    <div className="p-6 space-y-6">
      {/* Welcome Section */}
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">Welcome back, {user?.name}! 👋</h2>
        <p className="text-muted-foreground">
          Here&apos;s what&apos;s happening with your competitions today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {participantStats.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <Card
              key={index}
              className="card-optimized hover:shadow-md transition-fast"
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      {stat.title}
                    </p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p
                      className={`text-xs flex items-center mt-1 ${
                        stat.trend === "up" ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      <TrendingUp className="h-3 w-3 mr-1" />
                      {stat.change}
                    </p>
                  </div>
                  <div className="h-8 w-8 bg-primary/10 rounded-lg flex items-center justify-center">
                    <IconComponent className="h-4 w-4 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activities */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Recent Activities
                <Link href="/dashboard/announcements">
                  <Button variant="ghost" size="sm">
                    View All
                  </Button>
                </Link>
              </CardTitle>
              <CardDescription>Your latest actions and updates</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {combinedActivities.length > 0 ? (
                combinedActivities.map((activity) => {
                  const IconComponent = activity.icon;
                  return (
                    <div
                      key={activity.id}
                      className="flex items-start gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors-fast"
                    >
                      <div
                        className={`h-8 w-8 rounded-lg flex items-center justify-center ${
                          activity.type === "important-announcement"
                            ? "bg-orange-100 text-orange-600"
                            : "bg-blue-100 text-blue-600"
                        }`}
                      >
                        <IconComponent className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium">
                            {activity.title}
                          </p>
                          {activity.isImportant && (
                            <Star className="h-3 w-3 text-orange-500 fill-current" />
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground flex items-center mt-1">
                          <Clock className="h-3 w-3 mr-1" />
                          {activity.time}
                          {activity.eventName && (
                            <>
                              <span className="mx-2">•</span>
                              {activity.eventName}
                            </>
                          )}
                        </p>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Megaphone className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No recent activities</p>
                  <p className="text-sm">
                    Activities will appear here when organizers post
                    announcements or when you participate in events.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions & Upcoming */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Frequently used features</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-3">
              <Link href="/competitions">
                <Button
                  variant="outline"
                  className="h-16 flex flex-col gap-2 w-full"
                >
                  <Trophy className="h-5 w-5" />
                  <span className="text-xs">Competitions</span>
                </Button>
              </Link>
              <Button variant="outline" className="h-16 flex flex-col gap-2">
                <Users className="h-5 w-5" />
                <span className="text-xs">Join Team</span>
              </Button>
              <Button variant="outline" className="h-16 flex flex-col gap-2">
                <Target className="h-5 w-5" />
                <span className="text-xs">Challenges</span>
              </Button>
              <Button variant="outline" className="h-16 flex flex-col gap-2">
                <Award className="h-5 w-5" />
                <span className="text-xs">Achievements</span>
              </Button>
            </CardContent>
          </Card>

          {/* Upcoming Events */}
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Events</CardTitle>
              <CardDescription>Don&apos;t miss these events</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {upcomingEvents.length > 0 ? (
                upcomingEvents.map((event) => (
                  <div
                    key={event.EventID}
                    className="flex items-center gap-3 p-3 border rounded-lg"
                  >
                    <div
                      className={`h-2 w-2 rounded-full ${
                        event.IsActive ? "bg-green-500" : "bg-gray-400"
                      }`}
                    ></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {event.Name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(event.StartDate).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          hour: "numeric",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-4 text-muted-foreground">
                  <Calendar className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No upcoming events</p>
                  <p className="text-xs">Check back later for new events!</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

const DashboardPage = () => {
  const { user } = useAuth();

  if (user?.role === "organizer") {
    return <OrganizerDashboard />;
  }

  return <ParticipantDashboard />;
};

export default DashboardPage;
