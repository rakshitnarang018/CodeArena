'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, AlertTriangle, Home, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

type RoleType = "organizer" | "judge" | "participant";

interface RoleInfo {
  name: string;
  color: string;
  description: string;
  allowedRoutes: string[];
}

const roleInfo: Record<RoleType, RoleInfo> = {
  organizer: {
    name: "Organizer",
    color: "text-blue-600",
    description: "You can create and manage events, view all submissions, and oversee competitions.",
    allowedRoutes: [
      "Create Events",
      "Manage Events", 
      "View Submissions",
      "Organizer Dashboard"
    ]
  },
  judge: {
    name: "Judge",
    color: "text-purple-600", 
    description: "You can evaluate submissions, view events for judging, and access judging tools.",
    allowedRoutes: [
      "Judge Submissions",
      "View Events",
      "Judging Dashboard",
      "Evaluation Tools"
    ]
  },
  participant: {
    name: "Participant",
    color: "text-green-600",
    description: "You can join events, form teams, submit projects, and track your progress.",
    allowedRoutes: [
      "Join Events",
      "Team Management",
      "Submit Projects",
      "View Results"
    ]
  }
};

const getRouteDisplayName = (route: string): string => {
  const routeNames: Record<string, string> = {
    '/dashboard/events/create': 'Event Creation',
    '/dashboard/events/edit': 'Event Editing',
    '/dashboard/events/manage': 'Event Management',
    '/dashboard/organizer': 'Organizer Dashboard',
    '/dashboard/judge': 'Judge Dashboard',
    '/dashboard/judging': 'Judging Interface',
    '/dashboard/submissions': 'Submissions Review',
    '/dashboard/participant': 'Participant Dashboard',
    '/dashboard/teams': 'Team Management'
  };
  
  return routeNames[route] || route;
};

function UnauthorizedContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [userRole, setUserRole] = useState<RoleType | null>(null);
  const [attemptedRoute, setAttemptedRoute] = useState<string>('');

  useEffect(() => {
    // Get user role from cookies or URL params
    const roleFromParams = searchParams.get('role') as RoleType;
    const routeFromParams = searchParams.get('route') || '';
    
    if (roleFromParams) {
      setUserRole(roleFromParams);
    } else {
      // Fallback to check cookies
      const cookies = document.cookie.split(';');
      const roleCookie = cookies.find(cookie => cookie.trim().startsWith('userRole='));
      if (roleCookie) {
        const role = roleCookie.split('=')[1] as RoleType;
        setUserRole(role);
      }
    }
    
    setAttemptedRoute(routeFromParams);
  }, [searchParams]);

  const handleGoHome = () => {
    if (userRole) {
      switch (userRole) {
        case 'organizer':
          router.push('/dashboard/organizer');
          break;
        case 'judge':
          router.push('/dashboard/judge');
          break;
        case 'participant':
        default:
          router.push('/dashboard');
          break;
      }
    } else {
      router.push('/dashboard');
    }
  };

  const currentRoleInfo = userRole ? roleInfo[userRole] : null;

  return (
    <div className="mt-3">
      <div className="">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 rounded-xl bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
                <Shield className="w-6 h-6 text-red-600" />
              </div>
              <h1 className="text-3xl font-bold text-foreground">
                Access Denied
              </h1>
            </div>
            <p className="text-lg text-muted-foreground">
              You don't have permission to access this resource
            </p>
          </div>

          {/* Main Card */}
          <Card className="border-0 shadow-lg md:border md:shadow-lg bg-background">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto w-16 h-16 rounded-full bg-red-50 dark:bg-red-900/20 flex items-center justify-center mb-4">
                <AlertTriangle className="w-8 h-8 text-red-600" />
              </div>
              <CardTitle className="text-2xl font-bold text-foreground">
                Insufficient Permissions
              </CardTitle>
              <CardDescription className="text-muted-foreground text-base">
                {attemptedRoute && (
                  <>You attempted to access <span className="font-semibold">{getRouteDisplayName(attemptedRoute)}</span></>
                )}
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Current Role Info */}
              {currentRoleInfo && (
                <Alert className="border-l-4 border-l-blue-500">
                  <Shield className="h-4 w-4" />
                  <AlertDescription className="ml-2">
                    <div className="space-y-2">
                      <p className="font-semibold">
                        Your current role: <span className={currentRoleInfo.color}>{currentRoleInfo.name}</span>
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {currentRoleInfo.description}
                      </p>
                    </div>
                  </AlertDescription>
                </Alert>
              )}

              {/* What you can access */}
              {currentRoleInfo && (
                <div className="space-y-3">
                  <h3 className="font-semibold text-foreground">What you can access:</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {currentRoleInfo.allowedRoutes.map((route, index) => (
                      <div key={index} className="flex items-center gap-2 p-2 rounded-lg bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300">
                        <div className="w-2 h-2 rounded-full bg-green-500"></div>
                        <span className="text-sm">{route}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <Button
                  onClick={handleGoHome}
                  className="flex-1 h-11 font-semibold bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <Home className="mr-2 h-4 w-4" />
                  Go to Dashboard
                </Button>
                
                <Button
                  variant="outline"
                  onClick={() => router.back()}
                  className="flex-1 h-11 bg-muted/50 hover:bg-muted border-border/50 hover:border-border"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Go Back
                </Button>
              </div>

              {/* Help Text */}
              <div className="text-center pt-4">
                <p className="text-sm text-muted-foreground">
                  Need different permissions?{' '}
                  <Link href="/contact" className="text-primary hover:underline font-medium">
                    Contact Support
                  </Link>
                  {' '}or{' '}
                  <Link href="/help" className="text-primary hover:underline font-medium">
                    Learn More
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default function UnauthorizedPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    }>
      <UnauthorizedContent />
    </Suspense>
  );
}