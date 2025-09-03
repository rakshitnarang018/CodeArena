'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useOrganizerData } from '@/hooks/useOrganizerData';
import { Calendar } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useEvents } from '@/hooks/useEvents';

// Import components
import {
  OrganizerEventsHeader,
  EventsStatsCards,
  EventsSearchBar,
  OrganizerEventsGrid,
  EventsLoadingState,
  EventsErrorState,
  ParticipantEventCard,
  ParticipantEventsFilters,
  EventsPagination,
} from './_components';

// Organizer Events Component
const OrganizerEventsPage = () => {
  const { myEvents, loading, error, refetch } = useOrganizerData();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredEvents = myEvents.filter(event =>
    event.Name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.Theme.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEventEdit = (eventId: number) => {
    console.log('Edit event:', eventId);
  };

  const handleEventDelete = (eventId: number) => {
    console.log('Delete event:', eventId);
  };

  const handleEventManage = (eventId: number) => {
    console.log('Manage event:', eventId);
  };

  if (loading) {
    return (
      <EventsLoadingState 
        title="My Events"
        description="Loading your events..."
      />
    );
  }

  if (error) {
    return (
      <EventsErrorState 
        title="My Events"
        error={error}
        onRetry={refetch}
      />
    );
  }

  return (
    <div className="p-6 space-y-6">
      <OrganizerEventsHeader
        title="My Events"
        description="Manage and monitor your events"
        createHref="/dashboard/events/create"
        createButtonText="Create Event"
      />

      <EventsSearchBar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        placeholder="Search events..."
      />

      <EventsStatsCards events={myEvents} />

      <OrganizerEventsGrid
        events={filteredEvents}
        searchTerm={searchTerm}
        onEdit={handleEventEdit}
        onDelete={handleEventDelete}
        onManage={handleEventManage}
      />
    </div>
  );
};

// Participant Events Component
const ParticipantEventsPage = () => {
  const { events, loading, error, refetch } = useEvents();
  const [currentPage, setCurrentPage] = useState(1);
  const eventsPerPage = 9;
  const [filters, setFilters] = useState({
    search: '',
    mode: 'all',
    status: 'all',
    theme: 'all'
  });

  // Filter events
  const filteredEvents = events.filter(event => {
    const matchesSearch = event.Name.toLowerCase().includes(filters.search.toLowerCase()) ||
                         event.Description.toLowerCase().includes(filters.search.toLowerCase());
    const matchesMode = filters.mode === 'all' || event.Mode === filters.mode;
    const matchesTheme = filters.theme === 'all' || event.Theme === filters.theme;
    
    const now = new Date();
    const startDate = new Date(event.StartDate);
    const endDate = new Date(event.EndDate);
    
    let matchesStatus = true;
    if (filters.status === 'upcoming') {
      matchesStatus = startDate > now;
    } else if (filters.status === 'ongoing') {
      matchesStatus = startDate <= now && endDate >= now;
    } else if (filters.status === 'completed') {
      matchesStatus = endDate < now;
    }
    
    return matchesSearch && matchesMode && matchesStatus && matchesTheme;
  });

  // Pagination
  const totalPages = Math.ceil(filteredEvents.length / eventsPerPage);
  const startIndex = (currentPage - 1) * eventsPerPage;
  const currentEvents = filteredEvents.slice(startIndex, startIndex + eventsPerPage);

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const handleRegister = (eventId: number) => {
    console.log('Register for event:', eventId);
  };

  const uniqueThemes = Array.from(new Set(events.map(e => e.Theme).filter(Boolean)));

  if (loading) {
    return (
      <EventsLoadingState 
        title="Events"
        description="Discover and join exciting competitions"
      />
    );
  }

  if (error) {
    return (
      <EventsErrorState 
        title="Events"
        error={error}
        onRetry={refetch}
      />
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold">Events</h1>
        <p className="text-muted-foreground">
          Discover and join exciting competitions
        </p>
      </div>

      <ParticipantEventsFilters
        searchQuery={filters.search}
        selectedMode={filters.mode}
        selectedTheme={filters.theme}
        onSearchChange={(value) => handleFilterChange('search', value)}
        onModeChange={(value) => handleFilterChange('mode', value)}
        onThemeChange={(value) => handleFilterChange('theme', value)}
        onClearFilters={() => {
          setFilters({ search: '', mode: 'all', status: 'all', theme: 'all' });
          setCurrentPage(1);
        }}
      />

      {currentEvents.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Calendar className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="text-lg font-semibold mb-2">No events found</h3>
            <p className="text-muted-foreground">
              {filteredEvents.length === 0 && filters.search ? 
                'No events match your search criteria.' : 
                'No events available at the moment.'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentEvents.map((event) => (
            <ParticipantEventCard
              key={event.EventID}
              event={event}
            />
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <EventsPagination
          currentPage={currentPage}
          totalPages={totalPages}
          hasNextPage={currentPage < totalPages}
          hasPrevPage={currentPage > 1}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  );
};

const EventsPage = () => {
  const { user } = useAuth();

  if (user?.role === 'organizer') {
    return <OrganizerEventsPage />;
  }

  return <ParticipantEventsPage />;
};

export default EventsPage;
