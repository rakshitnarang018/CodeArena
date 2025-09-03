'use client';

import { Trophy, Star, Gift, Award } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ReactElement } from 'react';

interface Event {
  Prizes: string;
}

interface EventPrizesProps {
  event: Event;
  formatList: (text: string) => ReactElement[];
}

export const EventPrizes = ({ event, formatList }: EventPrizesProps) => {
  // Parse prize information
  const parsePrizes = () => {
    const prizes = event.Prizes.split(',').map(prize => prize.trim());
    const parsedPrizes = [];
    
    for (const prize of prizes) {
      if (prize.toLowerCase().includes('1st')) {
        const match = prize.match(/\$?(\d+(?:,\d+)*)/);
        const amount = match ? parseInt(match[1].replace(/,/g, '')) : 0;
        const description = prize.split(':')[1]?.trim() || prize;
        parsedPrizes.push({
          position: '1st Place',
          amount,
          description,
          icon: Trophy
        });
      } else if (prize.toLowerCase().includes('2nd')) {
        const match = prize.match(/\$?(\d+(?:,\d+)*)/);
        const amount = match ? parseInt(match[1].replace(/,/g, '')) : 0;
        const description = prize.split(':')[1]?.trim() || prize;
        parsedPrizes.push({
          position: '2nd Place',
          amount,
          description,
          icon: Award
        });
      } else if (prize.toLowerCase().includes('3rd')) {
        const match = prize.match(/\$?(\d+(?:,\d+)*)/);
        const amount = match ? parseInt(match[1].replace(/,/g, '')) : 0;
        const description = prize.split(':')[1]?.trim() || prize;
        parsedPrizes.push({
          position: '3rd Place',
          amount,
          description,
          icon: Star
        });
      } else if (prize.toLowerCase().includes('special') || prize.toLowerCase().includes('recognition')) {
        const match = prize.match(/\$?(\d+(?:,\d+)*)/);
        const amount = match ? parseInt(match[1].replace(/,/g, '')) : 0;
        const description = prize.split(':')[1]?.trim() || prize;
        parsedPrizes.push({
          position: 'Special Recognition',
          amount,
          description,
          icon: Gift
        });
      }
    }
    
    return parsedPrizes;
  };

  const prizes = parsePrizes();

  return (
    <Card className="card-optimized">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-primary" />
          Prizes & Rewards
        </CardTitle>
      </CardHeader>
      <CardContent>
        {prizes.length > 0 ? (
          <div className="space-y-4">
            {prizes.map((prize, index) => {
              const Icon = prize.icon;
              return (
                <div 
                  key={index} 
                  className="bg-primary/5 dark:bg-primary/10 border border-primary/20 rounded-lg p-4 hover:shadow-md transition-all duration-200 hover:-translate-y-1"
                >
                  <div className="flex items-start gap-3">
                    <div className="bg-primary/10 dark:bg-primary/20 border border-primary/30 rounded-lg p-2">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-primary">
                          {prize.position}
                        </h3>
                        {prize.amount > 0 && (
                          <span className="text-xl font-bold text-primary">
                            ${prize.amount.toLocaleString()}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-primary/70">
                        {prize.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="prose prose-sm max-w-none">
            {formatList(event.Prizes)}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
