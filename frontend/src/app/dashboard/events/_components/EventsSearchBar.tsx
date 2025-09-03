import { Search, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface EventsSearchBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  placeholder?: string;
  showFilter?: boolean;
  onFilterClick?: () => void;
}

export const EventsSearchBar = ({ 
  searchTerm, 
  onSearchChange, 
  placeholder = "Search events...",
  showFilter = true,
  onFilterClick 
}: EventsSearchBarProps) => {
  return (
    <div className="flex items-center gap-4">
      <div className="relative flex-1 max-w-sm">
        <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder={placeholder}
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9"
        />
      </div>
      {showFilter && (
        <Button variant="outline" onClick={onFilterClick}>
          <Filter className="h-4 w-4 mr-2" />
          Filter
        </Button>
      )}
    </div>
  );
};
