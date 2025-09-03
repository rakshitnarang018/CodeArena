export type RoleType = "organizer" | "judge" | "participant";

export interface Role {
  id: string;
  name: string;
}

export interface UserData {
  id: string;
  email: string;
  name: string;
  role: RoleType;
  status: boolean;
  createdAt: string;
  updatedAt: string;
}

export const ROLES: Role[] = [
  { id: "organizer", name: "Organizer" },
  { id: "judge", name: "Judge" },
  { id: "participant", name: "Participant" }
];

export const roleProtectedRoutes: { [key: string]: RoleType[] } = {
  // Event Management - Only organizers
  "/dashboard/events/create": ["organizer"],
  "/dashboard/events/edit": ["organizer"],
  "/dashboard/events/manage": ["organizer"],
  "/dashboard/organizer": ["organizer"],
  
  // Judging - Only judges
  "/dashboard/judge": ["judge"],
  "/dashboard/judging": ["judge"],
  "/dashboard/submissions": ["judge","organizer", "participant"],

  // Participant specific
  "/dashboard/participant": ["participant"],
  "/dashboard/teams": ["participant"],
  
  // General access - All authenticated users
  "/dashboard/events": ["organizer", "judge", "participant"],
  "/dashboard/profile": ["organizer", "judge", "participant"],
  "/dashboard/settings": ["organizer", "judge", "participant"],
};

// Helper function to check if a user has access to a specific route
export const hasRouteAccess = (pathname: string, userRole: RoleType): boolean => {
  // Sort routes by length (longest first) to match most specific routes first
  const sortedRoutes = Object.keys(roleProtectedRoutes).sort((a, b) => b.length - a.length);
  
  for (const route of sortedRoutes) {
    if (pathname.startsWith(route)) {
      const allowedRoles = roleProtectedRoutes[route];
      return allowedRoles.includes(userRole);
    }
  }
  
  // If route is not in protected routes, allow access by default
  return true;
};

export default ROLES;
