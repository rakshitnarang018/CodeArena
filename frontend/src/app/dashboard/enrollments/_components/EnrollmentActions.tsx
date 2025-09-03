import { useState } from 'react';
import { 
  Download, 
  Mail, 
  Filter, 
  MoreHorizontal,
  RefreshCw 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';

interface EnrollmentActionsProps {
  totalEnrollments: number;
  filteredCount: number;
  onExport: () => void;
  onRefresh: () => void;
  onBulkEmail?: () => void;
  onClearFilters?: () => void;
  hasActiveFilters?: boolean;
}

export const EnrollmentActions = ({
  totalEnrollments,
  filteredCount,
  onExport,
  onRefresh,
  onBulkEmail,
  onClearFilters,
  hasActiveFilters = false
}: EnrollmentActionsProps) => {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await onRefresh();
    setIsRefreshing(false);
  };

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <h1 className="text-2xl font-bold">Event Enrollments</h1>
        {hasActiveFilters && (
          <Badge variant="secondary" className="ml-2">
            {filteredCount} of {totalEnrollments}
          </Badge>
        )}
      </div>
      
      <div className="flex items-center gap-2">
        <Button 
          variant="outline" 
          size="sm"
          onClick={handleRefresh}
          disabled={isRefreshing}
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
        
        <Button variant="outline" size="sm" onClick={onExport}>
          <Download className="h-4 w-4 mr-2" />
          Export CSV
        </Button>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <MoreHorizontal className="h-4 w-4 mr-2" />
              More Actions
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {onBulkEmail && (
              <>
                <DropdownMenuItem onClick={onBulkEmail}>
                  <Mail className="h-4 w-4 mr-2" />
                  Email All Participants
                </DropdownMenuItem>
                <DropdownMenuSeparator />
              </>
            )}
            {hasActiveFilters && onClearFilters && (
              <DropdownMenuItem onClick={onClearFilters}>
                <Filter className="h-4 w-4 mr-2" />
                Clear All Filters
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};
