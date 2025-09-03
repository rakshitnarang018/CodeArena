'use client';

import { Button } from '@/components/ui/button';

interface NotFoundStateProps {
  onBack: () => void;
}

export const NotFoundState = ({ onBack }: NotFoundStateProps) => {
  return (
    <div className="p-6 text-center">
      <h2 className="text-2xl font-bold mb-4">Event Not Found</h2>
      <p className="text-muted-foreground mb-4">The event you&apos;re looking for doesn&apos;t exist.</p>
      <Button onClick={onBack}>Go Back</Button>
    </div>
  );
};
