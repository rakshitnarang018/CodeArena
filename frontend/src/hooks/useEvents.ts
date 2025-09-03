import { useState, useEffect } from "react";
import { eventsAPI } from "@/lib/api";

export interface Event {
  EventID: number;
  OrganizerID: number;
  Name: string;
  Description: string;
  Theme: string;
  Mode: "Online" | "Offline" | "Hybrid";
  StartDate: string;
  EndDate: string;
  SubmissionDeadline: string | null;
  ResultDate: string | null;
  Rules: string;
  Timeline: string;
  Tracks: string;
  Prizes: string;
  MaxTeamSize: number;
  Sponsors: string | null;
  IsActive: boolean;
  CreatedAt: string;
}

export interface TeamMember {
  userid: number;
  name: string;
  email: string;
  Role: string;
}

export interface Team {
  TeamId: number;
  TeamName: string;
  EventId: number;
  CreatedAt: string;
  members: TeamMember[];
}

export interface EnrollmentData {
  isEnrolled: boolean;
  enrolledAt: string | null;
  userRole: string | null;
  team: Team | null;
}

export interface ParticipantEventResponse {
  success: boolean;
  message: string;
  data: {
    event: Event;
    enrollment: EnrollmentData;
  };
}

export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalEvents: number;
  eventsPerPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  nextPage: number | null;
  prevPage: number | null;
}

export interface EventsApiResponse {
  success: boolean;
  message: string;
  data: Event[];
  pagination: PaginationInfo;
}

interface ApiResponse {
  data?: Event[] | Event;
  success?: boolean;
  message?: string;
  pagination?: PaginationInfo;
  [key: string]: unknown;
}

const transformEvent = (apiEvent: Event): Event => {
  return apiEvent;
};

export interface EventSearchParams {
  query?: string;
  mode?: string;
  theme?: string;
}

export const useEvents = (page: number = 1) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEvents = async (pageNumber: number = page) => {
    try {
      setLoading(true);
      setError(null);
      const response = await eventsAPI.getAll(pageNumber) as ApiResponse;
      
      if (response.success && response.data) {
        const eventsData = Array.isArray(response.data) ? response.data : [response.data];
        const transformedEvents = eventsData.map(transformEvent);
        setEvents(transformedEvents);
        setPagination(response.pagination || null);
      } else {
        // Fallback for non-paginated response
        const eventsData = Array.isArray(response) ? response : (response.data as Event[] || []);
        const transformedEvents = eventsData.map(transformEvent);
        setEvents(transformedEvents);
        setPagination(null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch events");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents(page);
  }, [page]);

  return { 
    events, 
    pagination, 
    loading, 
    error, 
    refetch: fetchEvents,
    fetchPage: fetchEvents
  };
};

export const useUpcomingEvents = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUpcomingEvents = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await eventsAPI.getUpcoming() as ApiResponse;
      const eventsData = Array.isArray(response) ? response : (response.data as Event[] || []);
      const transformedEvents = eventsData.map(transformEvent);
      setEvents(transformedEvents);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch upcoming events"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUpcomingEvents();
  }, []);

  return { events, loading, error, refetch: fetchUpcomingEvents };
};

export const useEventSearch = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchEvents = async (params: EventSearchParams, page: number = 1) => {
    try {
      setLoading(true);
      setError(null);
      const response = await eventsAPI.search(
        params.query,
        params.mode,
        params.theme,
        page
      ) as ApiResponse;
      
      if (response.success && response.data) {
        const eventsData = Array.isArray(response.data) ? response.data : [response.data];
        const transformedEvents = eventsData.map(transformEvent);
        setEvents(transformedEvents);
        setPagination(response.pagination || null);
      } else {
        // Fallback for non-paginated response
        const eventsData = Array.isArray(response) ? response : (response.data as Event[] || []);
        const transformedEvents = eventsData.map(transformEvent);
        setEvents(transformedEvents);
        setPagination(null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to search events");
    } finally {
      setLoading(false);
    }
  };

  return { events, pagination, loading, error, searchEvents };
};

export const useOrganizerEvents = (organizerId: string, page: number = 1) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrganizerEvents = async (pageNumber: number = page) => {
    try {
      setLoading(true);
      setError(null);
      const response = await eventsAPI.getByOrganizer(organizerId, pageNumber) as ApiResponse;
      
      if (response.success && response.data) {
        const eventsData = Array.isArray(response.data) ? response.data : [response.data];
        const transformedEvents = eventsData.map(transformEvent);
        setEvents(transformedEvents);
        setPagination(response.pagination || null);
      } else {
        // Fallback for non-paginated response
        const eventsData = Array.isArray(response) ? response : (response.data as Event[] || []);
        const transformedEvents = eventsData.map(transformEvent);
        setEvents(transformedEvents);
        setPagination(null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch organizer events");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (organizerId) {
      fetchOrganizerEvents(page);
    }
  }, [organizerId, page]);

  return { 
    events, 
    pagination, 
    loading, 
    error, 
    refetch: fetchOrganizerEvents,
    fetchPage: fetchOrganizerEvents
  };
};

export const useEvent = (id: string | null) => {
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEvent = async (eventId: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await eventsAPI.getById(eventId) as ApiResponse;
      const eventData = (response.data as Event) || (response as unknown as Event);
      const transformedEvent = transformEvent(eventData);
      setEvent(transformedEvent);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch event");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchEvent(id);
    } else {
      setLoading(false);
    }
  }, [id]);

  return { event, loading, error, refetch: () => id && fetchEvent(id) };
};

export const useParticipantEvent = (id: string | null) => {
  const [event, setEvent] = useState<Event | null>(null);
  const [enrollment, setEnrollment] = useState<EnrollmentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchParticipantEvent = async (eventId: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await eventsAPI.getForParticipant(eventId) as ParticipantEventResponse;
      
      const transformedEvent = transformEvent(response.data.event);
      setEvent(transformedEvent);
      setEnrollment(response.data.enrollment);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch participant event data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchParticipantEvent(id);
    } else {
      setLoading(false);
    }
  }, [id]);

  return { 
    event, 
    enrollment, 
    loading, 
    error, 
    refetch: () => id && fetchParticipantEvent(id) 
  };
};
