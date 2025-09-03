'use client';

import { useAuth } from '@/contexts/AuthContext';
import { LoadingState } from '../submissions/_components';
import CertificateGenerator from './certificate-generator';

export default function CertificatesPage() {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingState />;
  }

  // Only allow organizers and judges to access certificate generation
  if (user?.role !== 'organizer' && user?.role !== 'judge') {
    return (
      <div className="container mx-auto p-6 max-w-4xl">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h1>
          <p className="text-muted-foreground">
            Only organizers and judges can generate certificates.
          </p>
        </div>
      </div>
    );
  }

  return <CertificateGenerator />;
}
