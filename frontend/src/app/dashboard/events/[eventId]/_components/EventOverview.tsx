'use client';

import { Calendar, Users, MapPin, Info, Palette, Clock, Building } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ReactElement } from 'react';
import { Event } from './types';

interface EventOverviewProps {
  event: Event;
  formatDate: (dateString: string) => string;
  formatList: (text: string) => ReactElement[];
}

export const EventOverview = ({ event, formatDate, formatList }: EventOverviewProps) => {
  return (
    <div className="space-y-6">
      {/* Key Information Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="card-optimized bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-200 dark:border-blue-800">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-500 text-white">
                <Calendar className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Duration</p>
                <p className="font-semibold">{Math.ceil((new Date(event.EndDate).getTime() - new Date(event.StartDate).getTime()) / (1000 * 60 * 60 * 24))} days</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="card-optimized bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 border-green-200 dark:border-green-800">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-500 text-white">
                <Users className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Team Size</p>
                <p className="font-semibold">Max {event.MaxTeamSize} members</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="card-optimized bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 border-purple-200 dark:border-purple-800">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-purple-500 text-white">
                <MapPin className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Mode</p>
                <p className="font-semibold">{event.Mode}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Event Details */}
      <Card className="card-optimized">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="h-5 w-5 text-blue-500" />
            Event Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Theme Section */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Palette className="h-4 w-4 text-blue-500" />
              <h4 className="font-semibold">Theme</h4>
            </div>
            <div className="bg-muted/50 rounded-lg p-4">
              <p className="text-sm">{event.Theme}</p>
            </div>
          </div>

          {/* Important Dates */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-green-500" />
              <h4 className="font-semibold">Important Dates</h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="bg-muted/30 rounded-lg p-4 text-center">
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Event Starts</p>
                <p className="font-semibold mt-1">{formatDate(event.StartDate)}</p>
              </div>
              <div className="bg-muted/30 rounded-lg p-4 text-center">
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Event Ends</p>
                <p className="font-semibold mt-1">{formatDate(event.EndDate)}</p>
              </div>
              <div className="bg-muted/30 rounded-lg p-4 text-center">
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Results</p>
                <p className="font-semibold mt-1">
                  {event.ResultDate ? formatDate(event.ResultDate) : 'TBD'}
                </p>
              </div>
            </div>
          </div>

          {/* Sponsors */}
          {event.Sponsors && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Building className="h-4 w-4 text-orange-500" />
                <h4 className="font-semibold">Sponsors & Partners</h4>
              </div>
              <div className="bg-gradient-to-r from-orange-50 to-yellow-50 dark:from-orange-950 dark:to-yellow-950 rounded-lg p-4 border border-orange-200 dark:border-orange-800">
                <p className="text-sm">{event.Sponsors}</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
