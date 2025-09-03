import Link from 'next/link';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface OrganizerEventsHeaderProps {
  title: string;
  description: string;
  createHref: string;
  createButtonText: string;
}

export const OrganizerEventsHeader = ({ 
  title, 
  description, 
  createHref, 
  createButtonText 
}: OrganizerEventsHeaderProps) => {
  return (
    <div className="flex items-center justify-between">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold">{title}</h1>
        <p className="text-muted-foreground">{description}</p>
      </div>
      <Link href={createHref}>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          {createButtonText}
        </Button>
      </Link>
    </div>
  );
};
