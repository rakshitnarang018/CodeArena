import { useState, useEffect } from "react";
import { eventsAPI } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";

export interface OrganizerStats {
  totalEvents: number;
  activeEvents: number;
  totalRegistrations: number;
  totalSubmissions: number;
  completedEvents: number;
  upcomingEvents: number;
}

export interface OrganizerEvent {
  EventID: number;
  Name: string;
  Description: string;
  Theme: string;
  Mode: "Online" | "Offline" | "Hybrid";
  StartDate: string;
  EndDate: string;
  IsActive: boolean;
  registrationCount?: number;
  submissionCount?: number;
}

export const useOrganizerData = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<OrganizerStats>({
    totalEvents: 0,
    activeEvents: 0,
    totalRegistrations: 0,
    totalSubmissions: 0,
    completedEvents: 0,
    upcomingEvents: 0,
  });
  const [myEvents, setMyEvents] = useState<OrganizerEvent[]>([]);
  const [recentActivities, setRecentActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrganizerData = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      setError(null);

      // Fetch organizer's events
      const eventsResponse = await eventsAPI.getByOrganizer(user.id) as any;
      const events = eventsResponse.data || [];
      setMyEvents(events);

      // Calculate stats from events
      const now = new Date();
      const activeEvents = events.filter((event: OrganizerEvent) => event.IsActive).length;
      const upcomingEvents = events.filter((event: OrganizerEvent) => 
        new Date(event.StartDate) > now
      ).length;
      const completedEvents = events.filter((event: OrganizerEvent) => 
        new Date(event.EndDate) < now
      ).length;

      // Mock some additional stats (these would come from separate APIs in real implementation)
      const totalRegistrations = events.reduce((sum: number) => sum + (Math.floor(Math.random() * 100) + 10), 0);
      const totalSubmissions = events.reduce((sum: number) => sum + (Math.floor(Math.random() * 50) + 5), 0);

      setStats({
        totalEvents: events.length,
        activeEvents,
        totalRegistrations,
        totalSubmissions,
        completedEvents,
        upcomingEvents,
      });

      // No fake activities - only real announcement data will be shown
      setRecentActivities([]);

    } catch (err) {
      console.error('Error fetching organizer data:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch organizer data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.role === 'organizer') {
      fetchOrganizerData();
    }
  }, [user]);

  return {
    stats,
    myEvents,
    recentActivities,
    loading,
    error,
    refetch: fetchOrganizerData,
  };
};
