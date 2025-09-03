import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Event {
  EventID: number;
  Name: string;
}

interface EnrollmentFiltersProps {
  searchQuery: string;
  selectedEvent: string;
  selectedStatus: string;
  selectedDateRange: string;
  events: Event[];
  onSearchChange: (value: string) => void;
  onEventChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onDateRangeChange: (value: string) => void;
}

export const EnrollmentFilters = ({
  searchQuery,
  selectedEvent,
  selectedStatus,
  selectedDateRange,
  events,
  onSearchChange,
  onEventChange,
  onStatusChange,
  onDateRangeChange
}: EnrollmentFiltersProps) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <div className="relative flex-1">
        <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search participants, events, or teams..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9"
        />
      </div>
      
      <Select value={selectedEvent} onValueChange={onEventChange}>
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="All Events" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Events</SelectItem>
          {events.map((event) => (
            <SelectItem key={event.EventID} value={event.EventID.toString()}>
              {event.Name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      <Select value={selectedStatus} onValueChange={onStatusChange}>
        <SelectTrigger className="w-[150px]">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Status</SelectItem>
          <SelectItem value="Enrolled">Enrolled</SelectItem>
          <SelectItem value="Waitlisted">Waitlisted</SelectItem>
          <SelectItem value="Cancelled">Cancelled</SelectItem>
        </SelectContent>
      </Select>
      
      <Select value={selectedDateRange} onValueChange={onDateRangeChange}>
        <SelectTrigger className="w-[150px]">
          <SelectValue placeholder="Date Range" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Time</SelectItem>
          <SelectItem value="today">Today</SelectItem>
          <SelectItem value="week">This Week</SelectItem>
          <SelectItem value="month">This Month</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};
