'use client';

import { FileText, Users, Code, Shield, Upload, Clock, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ReactElement } from 'react';

interface Event {
  Rules: string;
}

interface EventRulesProps {
  event: Event;
  formatList: (text: string) => ReactElement[];
}

export const EventRules = ({ event, formatList }: EventRulesProps) => {
  // Parse rules and assign appropriate icons
  const parseRules = () => {
    const rules = event.Rules.split(',').map(rule => rule.trim());
    
    return rules.map((rule, index) => {
      let icon = CheckCircle;
      const lowerRule = rule.toLowerCase();
      
      if (lowerRule.includes('team') || lowerRule.includes('member')) {
        icon = Users;
      } else if (lowerRule.includes('code') || lowerRule.includes('original') || lowerRule.includes('plagiarism')) {
        icon = Code;
      } else if (lowerRule.includes('open source') || lowerRule.includes('technolog')) {
        icon = Shield;
      } else if (lowerRule.includes('submission') || lowerRule.includes('submit')) {
        icon = Upload;
      } else if (lowerRule.includes('deadline') || lowerRule.includes('time')) {
        icon = Clock;
      }
      
      return {
        text: rule,
        icon,
        id: index
      };
    });
  };

  const rules = parseRules();

  return (
    <Card className="card-optimized">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-primary" />
          Rules & Guidelines
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {rules.map((rule) => {
            const Icon = rule.icon;
            return (
              <div 
                key={rule.id}
                className="bg-muted/30 border border-border rounded-lg p-4 hover:shadow-md transition-all duration-200 hover:-translate-y-1"
              >
                <div className="flex items-start gap-3">
                  <div className="bg-primary/10 dark:bg-primary/20 border border-primary/30 rounded-lg p-2 flex-shrink-0">
                    <Icon className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-foreground leading-relaxed">
                      {rule.text}
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
