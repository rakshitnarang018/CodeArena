// Authentication and role-based access control utilities
import Cookies from 'js-cookie';

export type UserRole = 'participant' | 'organizer' | 'judge';

// Get user role from cookies
export const getUserRole = (): UserRole | null => {
  if (typeof window !== 'undefined') {
    return (Cookies.get('userRole') as UserRole) || null;
  }
  return null;
};

// Get user ID from cookies
export const getUserId = (): string | null => {
  if (typeof window !== 'undefined') {
    return Cookies.get('userId') || null;
  }
  return null;
};

// Get full user data from cookies
export const getUserFromCookies = () => {
  if (typeof window !== 'undefined') {
    const userStr = Cookies.get('user');
    return userStr ? JSON.parse(userStr) : null;
  }
  return null;
};

// Check if user has specific role
export const hasRole = (requiredRole: UserRole): boolean => {
  const userRole = getUserRole();
  return userRole === requiredRole;
};

// Check if user has any of the required roles
export const hasAnyRole = (requiredRoles: UserRole[]): boolean => {
  const userRole = getUserRole();
  return userRole ? requiredRoles.includes(userRole) : false;
};

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  if (typeof window !== 'undefined') {
    return !!Cookies.get('authToken');
  }
  return false;
};

// Role-based route protection helpers
export const canAccessOrganizerRoutes = (): boolean => {
  return hasRole('organizer');
};

export const canAccessJudgeRoutes = (): boolean => {
  return hasRole('judge');
};

export const canAccessParticipantRoutes = (): boolean => {
  return hasRole('participant');
};

// Check if user can access admin features (organizer or judge
export const canAccessAdminFeatures = (): boolean => {
  return hasAnyRole(['organizer', 'judge']);
};

export const getDefaultRedirectPath = (role: UserRole): string => {
  switch (role) {
    case 'organizer':
      return '/dashboard/organizer';
    case 'judge':
      return '/dashboard/judge';
    case 'participant':
    default:
      return '/dashboard';
  }
};
