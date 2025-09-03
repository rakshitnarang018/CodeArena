import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search, Plus, Filter } from 'lucide-react';

interface TeamFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedEvent: string;
  onEventChange: (eventId: string) => void;
  selectedRole: string;
  onRoleChange: (role: string) => void;
  onCreateTeam: () => void;
  availableEvents: Array<{ EventID: number; Name: string }>;
}

export const TeamFilters: React.FC<TeamFiltersProps> = ({
  searchQuery,
  onSearchChange,
  selectedEvent,
  onEventChange,
  selectedRole,
  onRoleChange,
  onCreateTeam,
  availableEvents
}) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6">
      {/* Search */}
      <div className="relative flex-1">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search teams..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Event Filter */}
      <Select value={selectedEvent} onValueChange={onEventChange}>
        <SelectTrigger className="w-full sm:w-[200px]">
          <SelectValue placeholder="All Events" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Events</SelectItem>
          {availableEvents.map((event) => (
            <SelectItem key={event.EventID} value={event.EventID.toString()}>
              {event.Name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Role Filter */}
      <Select value={selectedRole} onValueChange={onRoleChange}>
        <SelectTrigger className="w-full sm:w-[150px]">
          <Filter className="h-4 w-4 mr-2" />
          <SelectValue placeholder="All Roles" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Roles</SelectItem>
          <SelectItem value="leader">Team Leader</SelectItem>
          <SelectItem value="member">Team Member</SelectItem>
        </SelectContent>
      </Select>

      {/* Create Team Button */}
      <Button onClick={onCreateTeam} className="w-full sm:w-auto">
        <Plus className="h-4 w-4 mr-2" />
        Create Team
      </Button>
    </div>
  );
};
