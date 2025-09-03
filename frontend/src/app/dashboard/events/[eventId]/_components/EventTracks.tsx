'use client';

import { Target, Code, Smartphone, Brain, Shield, Database, Globe, Cpu } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ReactElement } from 'react';

interface Event {
  Tracks: string;
}

interface EventTracksProps {
  event: Event;
  formatList: (text: string) => ReactElement[];
}

export const EventTracks = ({ event, formatList }: EventTracksProps) => {
  // Parse tracks and assign appropriate icons
  const parseTracks = () => {
    const tracks = event.Tracks.split(',').map(track => track.trim());
    
    return tracks.map((track, index) => {
      let icon = Target;
      const lowerTrack = track.toLowerCase();
      
      if (lowerTrack.includes('web') || lowerTrack.includes('development')) {
        icon = Code;
      } else if (lowerTrack.includes('mobile') || lowerTrack.includes('app')) {
        icon = Smartphone;
      } else if (lowerTrack.includes('ai') || lowerTrack.includes('ml') || lowerTrack.includes('machine')) {
        icon = Brain;
      } else if (lowerTrack.includes('cyber') || lowerTrack.includes('security')) {
        icon = Shield;
      } else if (lowerTrack.includes('data') || lowerTrack.includes('science')) {
        icon = Database;
      } else if (lowerTrack.includes('blockchain') || lowerTrack.includes('crypto')) {
        icon = Globe;
      } else if (lowerTrack.includes('iot') || lowerTrack.includes('hardware')) {
        icon = Cpu;
      }
      
      return {
        name: track,
        icon
      };
    });
  };

  const tracks = parseTracks();

  return (
    <Card className="card-optimized">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5 text-primary" />
          Competition Tracks
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {tracks.map((track, index) => {
            const Icon = track.icon;
            return (
              <div 
                key={index}
                className="bg-primary/5 dark:bg-primary/10 border border-primary/20 rounded-lg p-4 hover:shadow-md transition-all duration-200 hover:-translate-y-1"
              >
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 dark:bg-primary/20 border border-primary/30 rounded-lg p-2">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-primary">
                      {track.name}
                    </h3>
                    <p className="text-xs text-primary/70 mt-1">
                      Compete in this specialized track
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
