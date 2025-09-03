'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, FileText, Trophy, Users } from 'lucide-react';

interface EmptyStateProps {
  onCreateSubmission: () => void;
}

export default function EmptyState({ onCreateSubmission }: EmptyStateProps) {
  return (
    <div className="text-center py-12">
      <div className="mx-auto max-w-md">
        <div className="mx-auto h-24 w-24 rounded-full bg-muted flex items-center justify-center mb-6">
          <FileText className="h-12 w-12 text-muted-foreground" />
        </div>
        
        <h3 className="text-xl font-semibold mb-2">No submissions yet</h3>
        <p className="text-muted-foreground mb-8">
          Start by creating your first project submission. Share your innovative ideas and compete with other teams!
        </p>
        
        <Button 
          onClick={onCreateSubmission}
          size="lg"
          className="mb-8"
        >
          <Plus className="h-4 w-4 mr-2" />
          Create Your First Submission
        </Button>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
          <Card className="p-4">
            <CardContent className="p-0">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                  <FileText className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-medium text-sm">Share Your Project</h4>
                  <p className="text-xs text-muted-foreground">Upload code, demos, and documentation</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="p-4">
            <CardContent className="p-0">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                  <Users className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <h4 className="font-medium text-sm">Team Collaboration</h4>
                  <p className="text-xs text-muted-foreground">Work together with your team members</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="p-4">
            <CardContent className="p-0">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center">
                  <Trophy className="h-4 w-4 text-purple-600" />
                </div>
                <div>
                  <h4 className="font-medium text-sm">Compete & Win</h4>
                  <p className="text-xs text-muted-foreground">Get judged and win exciting prizes</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
