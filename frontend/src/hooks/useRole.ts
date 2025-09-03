'use client';

import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/lib/auth-utils';

export const useRole = () => {
  const { user, isAuthenticated } = useAuth();

  const hasRole = (role: UserRole): boolean => {
    return isAuthenticated && user?.role === role;
  };

  const hasAnyRole = (roles: UserRole[]): boolean => {
    return isAuthenticated && user ? roles.includes(user.role) : false;
  };

  const isParticipant = (): boolean => hasRole('participant');
  const isOrganizer = (): boolean => hasRole('organizer');
  const isJudge = (): boolean => hasRole('judge');
  const isAdmin = (): boolean => hasAnyRole(['organizer', 'judge']);

  return {
    user,
    isAuthenticated,
    hasRole,
    hasAnyRole,
    isParticipant,
    isOrganizer,
    isJudge,
    isAdmin,
    role: user?.role || null,
  };
};
