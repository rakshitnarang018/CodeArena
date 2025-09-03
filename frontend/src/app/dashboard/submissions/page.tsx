'use client';

import { useAuth } from '@/contexts/AuthContext';
import { LoadingState } from './_components';
import OrganizerSubmissionsPage from './organizer-view';
// Import participant view
import ParticipantSubmissionsPage from '@/app/dashboard/submissions/participant-view';

export default function SubmissionsPage() {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingState />;
  }

  // Route to appropriate view based on user role
  if (user?.role === 'organizer' || user?.role === 'judge') {
    return <OrganizerSubmissionsPage />;
  }

  return <ParticipantSubmissionsPage />;
}
