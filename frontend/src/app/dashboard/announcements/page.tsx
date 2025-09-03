'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRole } from '@/hooks/useRole';
import OrganizerView from './organizer-view';
import ParticipantView from './participant-view';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle } from 'lucide-react';

export default function AnnouncementsPage() {
  const { user, loading } = useAuth();
  const { role } = useRole();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-yellow-500" />
            Access Denied
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p>Please log in to view announcements.</p>
        </CardContent>
      </Card>
    );
  }

  if (role === 'organizer') {
    return <OrganizerView />;
  } else if (role === 'participant') {
    return <ParticipantView />;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Announcements</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Loading your announcements...</p>
      </CardContent>
    </Card>
  );
}
