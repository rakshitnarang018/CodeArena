'use client';

import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

interface EventHeaderProps {
  eventStatus: {
    status: string;
    color: string;
    text: string;
  };
  onBack: () => void;
}

export const EventHeader = ({ eventStatus, onBack }: EventHeaderProps) => {
  return (
    <div className="flex items-center gap-4 mb-6">
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={onBack}
        className="gap-2"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Events
      </Button>
      <Separator orientation="vertical" className="h-6" />
      <div className="flex items-center gap-2">
        <Badge variant={eventStatus.color === 'green' ? 'default' : 'secondary'} className={`
          ${eventStatus.color === 'green' ? 'bg-green-100 text-green-700 border-green-200' : ''}
          ${eventStatus.color === 'blue' ? 'bg-blue-100 text-blue-700 border-blue-200' : ''}
          ${eventStatus.color === 'orange' ? 'bg-orange-100 text-orange-700 border-orange-200' : ''}
          ${eventStatus.color === 'gray' ? 'bg-gray-100 text-gray-700 border-gray-200' : ''}
        `}>
          {eventStatus.text}
        </Badge>
      </div>
    </div>
  );
};
