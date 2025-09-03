'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole, hasAnyRole, isAuthenticated } from '@/lib/auth-utils';

interface WithAuthProps {
  requiredRoles?: UserRole[];
  redirectTo?: string;
  requireAuth?: boolean;
}

// HOC for protecting routes based on authentication and roles
export function withAuth<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  options: WithAuthProps = {}
) {
  const {
    requiredRoles = [],
    redirectTo = '/auth/login',
    requireAuth = true,
  } = options;

  return function AuthenticatedComponent(props: P) {
    const { isAuthenticated: contextAuth, user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
      // Wait for auth context to load
      if (loading) return;

      // Check if authentication is required
      if (requireAuth && !contextAuth) {
        router.push(redirectTo);
        return;
      }

      // Check role-based access if roles are specified
      if (requiredRoles.length > 0 && user) {
        const hasRequiredRole = requiredRoles.includes(user.role);
        if (!hasRequiredRole) {
          // Redirect to appropriate dashboard based on user role
          const roleRedirects = {
            participant: '/dashboard',
            organizer: '/dashboard/organizer',
            judge: '/dashboard/judge',
          };
          router.push(roleRedirects[user.role] || '/dashboard');
          return;
        }
      }
    }, [contextAuth, user, loading, router]);

    // Show loading state while checking auth
    if (loading) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
        </div>
      );
    }

    // Don't render if not authenticated and auth is required
    if (requireAuth && !contextAuth) {
      return null;
    }

    // Don't render if role requirements are not met
    if (requiredRoles.length > 0 && user && !requiredRoles.includes(user.role)) {
      return null;
    }

    return <WrappedComponent {...props} />;
  };
}

// Specific HOCs for different role requirements
export const withParticipantAuth = <P extends object>(
  WrappedComponent: React.ComponentType<P>
) => withAuth(WrappedComponent, { requiredRoles: ['participant'] });

export const withOrganizerAuth = <P extends object>(
  WrappedComponent: React.ComponentType<P>
) => withAuth(WrappedComponent, { requiredRoles: ['organizer'] });

export const withJudgeAuth = <P extends object>(
  WrappedComponent: React.ComponentType<P>
) => withAuth(WrappedComponent, { requiredRoles: ['judge'] });

export const withAdminAuth = <P extends object>(
  WrappedComponent: React.ComponentType<P>
) => withAuth(WrappedComponent, { requiredRoles: ['organizer', 'judge'] });

export const withAnyAuth = <P extends object>(
  WrappedComponent: React.ComponentType<P>
) => withAuth(WrappedComponent, { requireAuth: true, requiredRoles: [] });
