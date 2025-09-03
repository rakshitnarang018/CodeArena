import { AlertCircle, RefreshCw } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';

interface EventsErrorStateProps {
  title?: string;
  error: string;
  onRetry?: () => void;
}

export const EventsErrorState = ({ 
  title = "My Events", 
  error, 
  onRetry 
}: EventsErrorStateProps) => {
  return (
    <div className="p-6 space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold">{title}</h1>
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Error loading events: {error}
            {onRetry && (
              <Button 
                variant="outline" 
                size="sm" 
                className="ml-2"
                onClick={onRetry}
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Retry
              </Button>
            )}
          </AlertDescription>
        </Alert>
      </div>
    </div>
  );
};
