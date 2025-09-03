import { useState } from 'react';
import { Filter } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface ParticipantEventsFiltersProps {
  searchQuery: string;
  selectedMode: string;
  selectedTheme: string;
  onSearchChange: (value: string) => void;
  onModeChange: (value: string) => void;
  onThemeChange: (value: string) => void;
  onClearFilters: () => void;
}

export const ParticipantEventsFilters = ({
  searchQuery,
  selectedMode,
  selectedTheme,
  onSearchChange,
  onModeChange,
  onThemeChange,
  onClearFilters,
}: ParticipantEventsFiltersProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Find Events</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Input
              placeholder="Search events, themes, organizers..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={selectedMode} onValueChange={onModeChange}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="Mode" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Modes</SelectItem>
              <SelectItem value="Online">Online</SelectItem>
              <SelectItem value="Offline">Offline</SelectItem>
              <SelectItem value="Hybrid">Hybrid</SelectItem>
            </SelectContent>
          </Select>
          {(searchQuery || (selectedMode !== 'all') || (selectedTheme !== 'all')) && (
            <Button variant="outline" onClick={onClearFilters}>
              <Filter className="h-4 w-4 mr-2" />
              Clear
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
